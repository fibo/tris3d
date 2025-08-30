import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { Tris3dBoard } from '@tris3d/game'

test('new Board', () => {
  const board = new Tris3dBoard()
  assert.deepEqual(board.moves, [], 'is empty')
  assert.equal(board.gameIsOver, false, 'game is not over')
  assert.equal(board.hasWinner, undefined, 'hasWinner is not defined')
  assert.equal(board.isTie, undefined, 'isTie is not defined')
  assert.equal(board.turnPlayer, 0, 'starts with player 0')
  assert.equal(board.addMove('A'), true, 'can start playing')
  assert.equal(board.turnPlayer, 1, 'after first move is player 1')
  assert.equal(board.addMove('B'), true)
  assert.equal(board.turnPlayer, 2)
  assert.equal(board.addMove('C'), true)
  assert.equal(board.turnPlayer, 0)
})

test('game play', () => {
  for (const { turnPlayer, gameIsOver, hasWinner, moves } of [
    {
      turnPlayer: 0,
      gameIsOver: false,
      moves: [],
    },
    {
      turnPlayer: 1,
      gameIsOver: false,
      moves: ['A', 'B', 'C', 'D'],
    },
    {
      gameIsOver: true,
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'V'],
      hasWinner: true,
    },
    {
      turnPlayer: 1,
      gameIsOver: false,
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'B'],
    },
    {
      gameIsOver: true,
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'B', 'C', 'D', 'V'],
      hasWinner: true,
    },
    // TODO test tie
    // {
    //   gameIsOver: true,
    //   moves: [
    //     'A', 'B', 'C', 'D', 'E', 'F', 'G', '*', 'I', 'H',
    //     'K', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    //     'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    //   ],
    //   hasWinner: false,
    //   hasTie: true,
    //   turnPlayer: undefined,
    // },
  ]) {
    const board = new Tris3dBoard()
    for (const move of moves) {
      assert.equal(board.addMove(move), true, 'add move')
    }
    assert.equal(board.turnPlayer, turnPlayer, 'turnPlayer')
    assert.equal(board.gameIsOver, gameIsOver, 'gameIsOver')
    assert.equal(board.hasWinner, hasWinner, 'hasWinner')
  }
})

test('invalid moves', () => {
  const board = new Tris3dBoard()
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
    assert.ok(board.hasWinner, 'has winner')
  }
})
