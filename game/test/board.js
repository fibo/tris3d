import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { Tris3dBoard } from 'tris3d-game'

test('new Board', () => {
  const board = new Tris3dBoard()
  assert.equal(board.addMove('A'), false, 'is readonly')
  assert.deepEqual(board.moves, [], 'is empty')
  assert.equal(board.turnPlayer, undefined, 'has no turn player')
  assert.equal(board.gameIsOver, false, 'game is not over')
})

test('game play', () => {
  for (const { turnPlayer, gameIsOver, moves, status } of [
    {
      turnPlayer: 0,
      gameIsOver: false,
      moves: [],
      status: Tris3dBoard.IS_PLAYING,
    },
    {
      turnPlayer: 1,
      gameIsOver: false,
      moves: ['A', 'B', 'C', 'D'],
      status: Tris3dBoard.IS_PLAYING,
    },
  ]) {
    const board = new Tris3dBoard()
    board.play()
    for (const move of moves)
      assert.equal(board.addMove(move), true, 'add move')
    assert.equal(board.turnPlayer, turnPlayer, 'turnPlayer')
    assert.equal(board.gameIsOver, gameIsOver, 'gameIsOver')
    assert.equal(board.status, status, 'status')
  }
})
