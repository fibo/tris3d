import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { tryToBlock, victoryIsMine } from '../src/AI.js'

test('tryToBlock', () => {
  assert.equal(tryToBlock(['A', 'H', 'G', '*', 'I'], 0), 'V')
  assert.equal(tryToBlock(['P', 'A', 'H', 'G', '*'], 1), 'V')

  assert.equal(tryToBlock(['P'], 0), undefined, 'cannot block itself')
})

test('victoryIsMine', () => {
  assert.equal(victoryIsMine(['A', 'H', 'G', '*', 'I', 'F']), 'V')
})
