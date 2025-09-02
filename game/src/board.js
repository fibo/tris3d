import { POSITIONS, WINNING_LINES } from './space.js'

// Game status constants.
const IS_PLAYING = 1
const HAS_WINNER = 2
const IS_TIE = 3

export class GameBoard {
  #moves = []
  #status = IS_PLAYING

  constructor(moves = []) {
    if (moves.length === 0) return
    for (const move of moves) {
      const success = this.addMove(move)
      if (!success) break
    }
  }

  get gameIsOver() {
    return this.#status > IS_PLAYING
  }

  get hasWinner() {
    if (this.#status === HAS_WINNER) return true
  }

  get isTie() {
    if (this.#status === IS_TIE) return true
  }

  get moves() { return this.#moves.slice() }

  get numWinningLines() {
    const numMoves = this.#moves.length
    // No player can win before the seventh move.
    if (numMoves < 7) return 0
    const movesOfCurrentPlayer = []
    for (let i = numMoves - 1; i >= 0; i -= 3) {
      movesOfCurrentPlayer.push(this.#moves[i])
    }
    let count = 0
    for (const line of WINNING_LINES) {
      if (line.every(position => movesOfCurrentPlayer.includes(position))) {
        count++
      }
    }
    return count
  }

  get status() { return this.#status }

  get turnPlayer() {
    if (this.#status !== IS_PLAYING) return
    return this.#moves.length % 3
  }

  /**
   * @param {string} position
   * @return {boolean} true if the move was added, false otherwise.
   */
  addMove(position) {
    // Do nothing if the game is not active.
    if (this.#status !== IS_PLAYING) return false
    // Check that given position is valid.
    const index = POSITIONS.indexOf(position)
    if (index === -1) return false
    // Check that given position is not already taken.
    if (this.#moves.includes(position)) return false
    // Add the move and check if the game has ended.
    this.#moves.push(position)
    if (this.numWinningLines > 0) {
      this.#status = HAS_WINNER
    } else if (this.#moves.length === 27) {
      this.#status = IS_TIE
    }
    return true
  }
}
