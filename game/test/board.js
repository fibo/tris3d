import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { GameBoard } from '@tris3d/game'

test('new Board', () => {
  const board = new GameBoard()
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
  for (const { turnPlayer, gameIsOver, hasWinner, isTie, moves } of [
    {
      moves: [],
      gameIsOver: false,
      turnPlayer: 0,
    },
    {
      moves: ['A', 'B', 'C', 'D'],
      gameIsOver: false,
      turnPlayer: 1,
    },
    {
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'V'],
      gameIsOver: true,
      hasWinner: true,
    },
    {
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'B'],
      gameIsOver: false,
      turnPlayer: 1,
    },
    {
      moves: ['A', 'H', 'G', '*', 'I', 'F', 'B', 'C', 'D', 'V'],
      gameIsOver: true,
      hasWinner: true,
    },
    {
      // moves leading to a tie
      moves: ['N', 'U', 'R', 'C', 'W', 'H', 'P', 'B', 'M', 'T', 'G', '*', 'K', 'A', 'X', 'F', 'Q', 'L', 'J', 'D', 'I', 'Y', 'O', 'S', 'Z', 'E', 'V'],
      gameIsOver: true,
      isTie: true,
    },
  ]) {
    const board = new GameBoard(moves)
    assert.equal(board.turnPlayer, turnPlayer, 'turnPlayer')
    assert.equal(board.gameIsOver, gameIsOver, 'gameIsOver')
    assert.equal(board.hasWinner, hasWinner, 'hasWinner')
    assert.equal(board.isTie, isTie, 'isTie')
  }
})

test('invalid moves', () => {
  const board = new GameBoard()
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
    const board = new GameBoard(moves)
    assert.deepEqual(board.moves, moves, 'moves')
  }

  {
    const moves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', '*', 'I', 'H']
    const board = new GameBoard([...moves, 'V'])
    assert.deepEqual(board.moves, moves, 'moves')
    assert.equal(board.gameIsOver, true, 'game is over')
    assert.ok(board.hasWinner, 'has winner')
  }
})
