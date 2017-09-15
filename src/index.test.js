// @flow
import pluginTester from 'babel-plugin-tester'
import plugin from '.'

pluginTester({
  plugin,
  snapshot: true,
  tests: [
    `type X = A`,
    `type X = Action`,
    `
    type Y = B;
    type X = A;
    `,
    `
    type X = A | B
    `,
    `
    type A = 'A'
    type X = A | B
    `,
    `
    type X = { type: ActionX };
    `,
    `
    type X = { type: A | B }
    `,
    `
    type X = { type: A }
    type Y = { type: B }
    type Action = X | Y
    `,
    `
    type Action = { type: ADD } | { type: INCREMENT }
    `
  ]
})
