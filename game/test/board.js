import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { Tris3dBoard } from '@tris3d/game'

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
    {
      gameIsOver: true,
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'V'],
      status: Tris3dBoard.HAS_WINNER,
    },
    {
      turnPlayer: 1,
      gameIsOver: false,
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'B'],
      status: Tris3dBoard.IS_PLAYING,
    },
    {
      gameIsOver: true,
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'B', 'C', 'D', 'V'],
      status: Tris3dBoard.HAS_WINNER,
    },
  ]) {
    const board = new Tris3dBoard()
    board.play()
    for (const move of moves) {
      assert.equal(board.addMove(move), true, 'add move')
    }
    assert.equal(board.turnPlayer, turnPlayer, 'turnPlayer')
    assert.equal(board.gameIsOver, gameIsOver, 'gameIsOver')
    assert.equal(board.status, status, 'status')
  }
})

test('invalid moves', () => {
  const board = new Tris3dBoard()
  board.play()
  assert.equal(board.addMove('-'), false, 'invalid position')
  assert.equal(board.addMove('A'), true, 'valid position')
  assert.equal(board.addMove('A'), false, 'position already taken')
  board.addMove('H')
  board.addMove('G')
  board.addMove('*')
  board.addMove('I')
  board.addMove('F')
  board.addMove('V')
  assert.equal(board.addMove('B'), false, 'game is over')
})

test('constructor with moves argument', () => {
  {
    const moves = ['A', 'B', 'C']
    const board = new Tris3dBoard(moves)
    assert.deepEqual(board.moves, moves, 'moves')
  }

  {
    const moves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', '*', 'I', 'H']
    const board = new Tris3dBoard([...moves, 'V'])
    assert.deepEqual(board.moves, moves, 'moves')
    assert.equal(board.gameIsOver, true, 'game is over')
    assert.equal(board.status, Tris3dBoard.HAS_WINNER, 'has winner')
  }
})
