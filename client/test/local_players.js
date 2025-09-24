import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { StateController } from '@tris3d/client'

describe('local_players', () => {
  test('no more than one human', () => {
    const state = new StateController()
    state.playmode = 'training'

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
    state.on_local_players((value) => {
      assert.deepEqual(value, expected[index])
    })
    index = 1
    state.local_players = input[0]
    state.dispose()
  })

  test('ai before human should no be stupid', () => {
    const state = new StateController()
    state.playmode = 'training'

    let check = false
    state.on_local_players((value) => {
      if (!check) return
      assert.deepEqual(value, ['stupid', 'smart', 'human'])
    })
    state.local_players = ['smart', 'smart', 'human']
    check = true
    state.local_players = ['smart', 'stupid', 'human']
    state.dispose()
  })
})
