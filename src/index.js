// @flow
import flowSyntax from 'babel-plugin-syntax-flow'
import * as t from 'babel-types'
import template from 'babel-template'

type Node = {
  type: string,
  [key: string]: any
}

type Path = {
  type: string,
  node: Node,
  [key: string]: any
}

type File = Object

type State = {
  file: File
}

const babylonOpts = { plugins: ['flow'] }

const typeDefineBuilder = template(`type ID = NAME`, babylonOpts)

const UNIQ = Symbol('defined-undefined-type')

const createDefineAST = name =>
  typeDefineBuilder({
    ID: t.identifier(name),
    NAME: t.stringLiteral(name)
  })

export default () => {
  return {
    inherits: flowSyntax,
    name: 'defined-undefined-type',
    pre(file: File) {
      if (!file.get(UNIQ)) {
        file.set(UNIQ, new Set())
      }
    },
    visitor: {
      TypeAlias(path: Node, { file }: State) {
        const definedTypes: Set<string> = file.get(UNIQ)

        const id = path.get('id').node.name
        definedTypes.add(id)

        function insertGenericType(nodePath: Path) {
          const name = nodePath.get('id').node.name
          if (!name || definedTypes.has(name)) {
            return
          }

          const ast = createDefineAST(name)

          definedTypes.add(name)
          path.insertBefore(ast)
        }

        function insertUnionType(unionPath: Path) {
          const typesPath = unionPath.get('types')
          for (const typePath of typesPath) {
            insert(typePath)
          }
        }

        function insertObjectType(objPath: Path) {
          const properties = objPath.get('properties')
          for (const propPath of properties) {
            insert(propPath.get('value'))
          }
        }

        function insert(targetPath: Path) {
          if (targetPath.isGenericTypeAnnotation()) {
            insertGenericType(targetPath)
          } else if (targetPath.isUnionTypeAnnotation()) {
            insertUnionType(targetPath)
          } else if (targetPath.isObjectTypeAnnotation()) {
            insertObjectType(targetPath)
          }
        }

        const rightPath = path.get('right')
        insert(rightPath)
      }
    }
  }
}
