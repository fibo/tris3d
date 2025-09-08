import { POSITIONS } from './space.js'

const CORNERS = ['A', 'C', 'E', 'G', 'R', 'T', 'V', 'X']

function stupid(moves) {
  if (moves.length === POSITIONS.length) return '' // No moves left.

  // Get center if available...
  if (!moves.includes('*')) {
    // ... not every time.
    if (Math.random() < 0.71) return '*'
  }

  // Pick up a corner.
  const availableCorners = CORNERS.filter(position => !moves.includes(position))
  // Get some corner if available...
  if (availableCorners.length) {
    const index = Math.floor(Math.random() * availableCorners.length)
    // ...not every time.
    if (Math.random() < 0.5) return availableCorners[index]
  }

  // No more strategy, pick random.
  const availableMoves = POSITIONS.filter(position => !moves.includes(position))
  const randomIndex = Math.floor(Math.random() * availableMoves.length)
  return availableMoves[randomIndex]
}

export const AI = {
  stupid,
  bastard: stupid,
  smart: stupid,
}
