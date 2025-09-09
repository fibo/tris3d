import { GameBoard } from './board.js'
import { POSITIONS } from './space.js'

function noMore(moves) {
  return moves.length === POSITIONS.length // No moves left.
}

/**
 * @example
 * const yeah = victoryIsMine(moves)
 * if (yeah) return yeah
*/
function victoryIsMine(moves) {
  const availableMoves = POSITIONS.filter(position => !moves.includes(position))

  for (const move of availableMoves) {
    const board = new GameBoard(moves)
    if (board.gameIsOver) break
    board.addMove(move)
    if (board.hasWinner) return move
  }
}

function stupid(moves) {
  if (noMore(moves)) return ''

  // Get center if available...
  if (!moves.includes('*')) {
    // ... not every time.
    if (Math.random() < 0.71) return '*'
  }

  // Pick up a corner...
  const availableCorners = [
    'A', 'C', 'E', 'G', 'R', 'T', 'V', 'X'
  ].filter(position => !moves.includes(position))
  if (availableCorners.length) {
    const index = Math.floor(Math.random() * availableCorners.length)
    // ...not every time.
    if (Math.random() < 0.5) return availableCorners[index]
  }

  // No more strategy, go random.
  const availableMoves = POSITIONS.filter(position => !moves.includes(position))
  const randomIndex = Math.floor(Math.random() * availableMoves.length)
  return availableMoves[randomIndex]
}

function smart(moves) {
  if (noMore(moves)) return ''

  const yeah = victoryIsMine(moves)
  if (yeah) return yeah

  // If no winning move is found, behave like a stupid AI.
  return stupid(moves)
}

function bastard(moves) {
  if (noMore(moves)) return ''

  return stupid(moves)
}

export const AI = {
  stupid,
  bastard,
  smart,
}
