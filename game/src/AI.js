import { GameBoard } from './board.js'
import { POSITIONS, WINNING_LINES } from './space.js'

function noMore(moves) {
  return moves.length === POSITIONS.length // No moves left.
}

function available(moves) {
  return POSITIONS.filter(position => !moves.includes(position))
}

export function victoryIsMine(moves) {
  for (const move of available(moves)) {
    const board = new GameBoard(moves)
    if (board.gameIsOver) break
    board.addMove(move)
    if (board.hasWinner) return move
  }
}

export function tryToBlock(moves, targetPlayerIndex) {
  if (targetPlayerIndex === moves.length % 3) return // Can't block itself.
  const targetPlayerMoves = moves.filter((_, index) => index % 3 === targetPlayerIndex)
  const availableMoves = available(moves)
  const winningLines = WINNING_LINES.map(line => line.sort().join(''))

  for (let k = 0; k < targetPlayerMoves.length; k++)
    for (let j = 0; j < k; j++)
      for (let i = 0; i < availableMoves.length; i++) {
        const position0 = availableMoves[i]
        const position1 = targetPlayerMoves[j]
        const position2 = targetPlayerMoves[k]
        const line = [position0, position1, position2].sort().join('')
        if (winningLines.includes(line)) return position0
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
  const availableMoves = available(moves)
  const randomIndex = Math.floor(Math.random() * availableMoves.length)
  return availableMoves[randomIndex]
}

function smart(moves) {
  if (noMore(moves)) return ''

  const win = victoryIsMine(moves)
  if (win) return win

  const nextPlayerIndex = (moves.length + 1) % 3
  const block = tryToBlock(moves, nextPlayerIndex)
  if (block) return block

  // If no winning move is found, behave like a stupid AI.
  return stupid(moves)
}

function bastard(moves, targetPlayerIndex = 0) {
  if (noMore(moves)) return ''

  const block = tryToBlock(moves, targetPlayerIndex)
  if (block) return block

  // If no winning move is found, behave like a smart AI.
  return smart(moves)
}

export const AI = {
  stupid,
  bastard,
  smart,
}
