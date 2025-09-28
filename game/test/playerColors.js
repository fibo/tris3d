import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { playerColor } from '@tris3d/game'

test('playerColor', () => {
  for (const [colorName, color] of Object.entries(playerColor)) {
    assert.equal(color.str, `#${color.hex.toString(16)}`, `color ${colorName} str ${color.str} matches hex`)
  }
})
