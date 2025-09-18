import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { publish, subscribe } from '@tris3d/state'
import '#src/state.js'

describe('local-players', () => {
  test('no more than one human', () => {
    let index = 0
    const input = [
      ['human', 'stupid', 'human'],
      ['stupid', 'smart', 'human'],
    ]
    const expected = [
      ['human', 'stupid', 'stupid'], // default value
      ['stupid', 'stupid', 'human'], // no more than one human
      input[1],
    ]
    const unsubscribe = subscribe('local-players', (value) => {
      assert.deepEqual(value, expected[index])
    })
    index = 1
    publish('local-players', input[0])
    unsubscribe()
  })

  test('ai before human should no be stupid', () => {
    let check = false
    publish('local-players', ['smart', 'smart', 'human'])
    const unsubscribe = subscribe('local-players', (value) => {
      if (!check) return
      assert.deepEqual(value, ['stupid', 'smart', 'human'])
    })
    check = true
    publish('local-players', ['smart', 'stupid', 'human'])
    unsubscribe()
  })
})
