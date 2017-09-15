// @flow
import p from 'path'
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
  [key: string]: any,
  get(key: string): Node
}

type File = Object

type State = {
  opts: Object,
  file: File
}

const babylonOpts = { plugins: ['flow'] }

const typeDefineBuilder = template(`type NAME = VALUE`, babylonOpts)

const KEY = Symbol('defined-undefined-type')

function getPrefix({ opts: { filename } }: File, removePrefix: string = '') {
  const file = p.relative(p.join(process.cwd(), removePrefix), filename)
  const dirname = p.dirname(file)
  return dirname + '/'
}

const createDefineAST = (name: string, value: string) =>
  typeDefineBuilder({
    NAME: t.identifier(name),
    VALUE: t.stringLiteral(value)
  })

export default () => {
  return {
    inherits: flowSyntax,
    name: 'defined-undefined-type',
    pre(file: File) {
      if (!file.get(KEY)) {
        file.set(KEY, new Set())
      }
    },
    visitor: {
      TypeAlias(path: Path, state: State) {
        const { file, opts } = state
        const definedTypes: Set<string> = file.get(KEY)

        definedTypes.add(path.get('id').node.name)

        function insertGenericType(nodePath: Path) {
          const name = nodePath.get('id').node.name
          if (!name || definedTypes.has(name)) {
            return
          }

          const prefix = opts.usePrefix
            ? getPrefix(file, opts.removePrefix)
            : ''
          const value = prefix + name
          const ast = createDefineAST(name, value)

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

        insert(path.get('right'))
      }
    }
  }
}
