// @flow
import path from 'path'
import pluginTester from 'babel-plugin-tester'
import plugin from '.'

const tests = [
  `type X = A`,
  `type X = Action`,
  `
  type Y = B;
  type X = A;
  `,
  `type X = A | B`,
  `
  type A = 'A'
  type X = A | B
  `,
  `type X = { type: ActionX };`,
  `type X = { type: A | B }`,
  `
  type X = { type: A }
  type Y = { type: B }
  type Action = X | Y
  `,
  `type Action = { type: ADD } | { type: INCREMENT }`
]

pluginTester({
  title: 'default',
  plugin,
  snapshot: true,
  tests
})

const filename = path.resolve(process.cwd(), 'app', 'counter', 'actions.js')

pluginTester({
  title: 'usePrefix',
  plugin,
  snapshot: true,
  babelOptions: { filename },
  pluginOptions: { usePrefix: true },
  tests
})

pluginTester({
  title: 'removePrefix',
  plugin,
  snapshot: true,
  babelOptions: { filename },
  pluginOptions: { usePrefix: true, removePrefix: 'app' },
  tests
})
