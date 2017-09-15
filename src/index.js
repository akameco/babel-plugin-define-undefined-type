// @flow
import { relative, join, dirname } from 'path'
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

const KEY = Symbol('define-undefined-type')

function getPrefix({ opts: { filename } }: File, removePrefix: string = '') {
  const file = relative(join(process.cwd(), removePrefix), filename)
  return dirname(file) + '/'
}

const createDefineAST = (name: string, value: string) =>
  typeDefineBuilder({
    NAME: t.identifier(name),
    VALUE: t.stringLiteral(value)
  })

export default () => {
  return {
    inherits: flowSyntax,
    name: 'define-undefined-type',
    pre(file: File) {
      if (!file.get(KEY)) {
        file.set(KEY, new Set())
      }
    },
    visitor: {
      TypeAlias(rootPath: Path, state: State) {
        const { file, opts } = state
        const definedTypes: Set<string> = file.get(KEY)

        definedTypes.add(rootPath.get('id').node.name)

        function insertGenericType(path: Path) {
          const name = path.get('id').node.name
          if (!name || definedTypes.has(name)) {
            return
          }

          const prefix = opts.usePrefix
            ? getPrefix(file, opts.removePrefix)
            : ''
          const value = prefix + name
          const ast = createDefineAST(name, value)

          definedTypes.add(name)
          rootPath.insertBefore(ast)
        }

        function insertUnionType(path: Path) {
          for (const p of path.get('types')) {
            insert(p)
          }
        }

        function insertObjectType(path: Path) {
          for (const p of path.get('properties')) {
            insert(p.get('value'))
          }
        }

        function insert(path: Path) {
          if (path.isGenericTypeAnnotation()) {
            insertGenericType(path)
          } else if (path.isUnionTypeAnnotation()) {
            insertUnionType(path)
          } else if (path.isObjectTypeAnnotation()) {
            insertObjectType(path)
          }
        }

        insert(rootPath.get('right'))
      }
    }
  }
}
