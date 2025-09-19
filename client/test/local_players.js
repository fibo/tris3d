import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { Client } from '@tris3d/client'

describe('local_players', () => {
  test('no more than one human', () => {
    const client = new Client()
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
    client.on({
      local_players: (value) => {
        assert.deepEqual(value, expected[index])
      },
    })
    index = 1
    client.local_players = input[0]
    client.dispose()
  })

  test('ai before human should no be stupid', () => {
    const client = new Client()
    let check = false
    client.on({
      local_players: (value) => {
        if (!check) return
        assert.deepEqual(value, ['stupid', 'smart', 'human'])
      },
    })
    client.local_players = ['smart', 'smart', 'human']
    check = true
    client.local_players = ['smart', 'stupid', 'human']
    client.dispose()
  })
})
