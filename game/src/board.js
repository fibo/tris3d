export class Tris3dBoard {
  // Game status constants.
  static IS_READONLY = 0
  static IS_PLAYING = 1
  static IS_WAITING = 1.1
  static HAS_WINNER = 2
  static IS_TIE = 3

  // Every board cell is associated with an uppercase latin letter
  // or the asterisc for the center. To enumerate cells, start from the center,
  // that is the '*' char. By convention the center of the cube has coordinates
  // `(1, 1, 1). Move in diagonal and label the cell as 'A'.
  // Any direction can be choosen, it will be then the 3d point with coordinates
  // `(0, 0, 0)`. Then proceed clock-wise walking through the perimeter of the
  // `z = -1` plane, and finally label the center of the plane. Done that,
  // continue with the upper plane `z = 0` in the same way. Notice that
  // this time the center is already taken. At the end do the same with
  // the last plane `z = 1`.
  //
  // This is the result of the board cell labelling.
  //
  // ```
  //            ______________________
  //          /       /       /       /
  //         /   T   /   U   /   V   /
  //        /_______/______ /______ /
  //       /       /       /       /
  //      /   S   /   Z   /   W   /
  //     /_______/______ /______ /
  //    /       /       /       /
  //   /   R   /   X   /   Y   /
  //  /_______/______ /______ /
  //            ______________________
  //          /       /       /       /
  //         /   L   /   M   /   N   /
  //        /_______/______ /______ /
  //       /       /       /       /
  //      /   K   /   *   /   O   /
  //     /_______/______ /______ /
  //    /       /       /       /
  //   /   J   /   Q   /   P   /
  //  /_______/______ /______ /
  //            ______________________
  //          /       /       /       /
  //         /   C   /   D   /   E   /
  //        /_______/______ /______ /
  //       /       /       /       /
  //      /   B   /   I   /   F   /
  //     /_______/______ /______ /
  //    /       /       /       /
  //   /   A   /   H   /   G   /
  //  /_______/______ /______ /
  //
  //  z   y
  //  ↑ ↗
  //  o → x
  //
  // ```
  //
  // These are the corresponding coordinates in 3d space.
  //
  // ```
  //            ______________________
  //          /       /       /       /
  //         / 0,2,2 / 1,2,2 / 2,2,2 /
  //        /_______/______ /______ /
  //       /       /       /       /
  //      / 0,1,2 / 1,1,2 / 2,1,2 /
  //     /_______/______ /______ /
  //    /       /       /       /
  //   / 0,0,2 / 1,0,2 / 2,0,2 /
  //  /_______/______ /______ /
  //            ______________________
  //          /       /       /       /
  //         / 0,2,1 / 1,2,1 / 2,2,1 /
  //        /_______/______ /______ /
  //       /       /       /       /
  //      / 0,1,1 / 1,1,1 / 2,1,1 /
  //     /_______/______ /______ /
  //    /       /       /       /
  //   / 0,0,1 / 1,0,1 / 2,0,1 /
  //  /_______/______ /______ /
  //            ______________________
  //          /       /       /       /
  //         / 0,2,0 / 1,2,0 / 2,2,0 /
  //        /_______/______ /______ /
  //       /       /       /       /
  //      / 0,1,0 / 1,1,0 / 2,1,0 /
  //     /_______/______ /______ /
  //    /       /       /       /
  //   / 0,0,0 / 1,0,0 / 2,0,0 /
  //  /_______/______ /______ /
  //
  //  z   y
  //  ↑ ↗
  //  o → x
  //
  // ```
  //
  // The index in the `POSITION` array corresponds to the `x, y, z`
  // coordinate in base 3, that is:
  //
  // ```
  // x, y, z -> x * 9 + y * 3 + z
  // ```
  static POSITION = [
    // First layer, `z = 0`.
    'A', 'H', 'G',
    'B', 'I', 'F',
    'C', 'D', 'E',
    // Second layer, `z = 1`.
    'J', 'Q', 'P',
    'K', '*', 'O',
    'L', 'M', 'N',
    // Third layer, `z = 2`.
    'R', 'X', 'Y',
    'S', 'Z', 'W',
    'T', 'U', 'V'
  ]

  #moves = []
  #status = Tris3dBoard.IS_READONLY

  get turnPlayer() {
    if (this.#status !== Tris3dBoard.IS_PLAYING) return
    return this.#moves.length % 3
  }

  get gameIsOver() { return this.#status >= 2 }

  get moves() { return this.#moves.slice() }

  get numWinningLines() {
    const numMoves = this.#moves.length
    // No player can win before the seventh move.
    if (numMoves < 7) return 0
  }

  get status() { return this.#status }

  /**
   * @param {string} position
   * @return {boolean} true if the move was added, false otherwise.
   */
  addMove(position) {
    // Do nothing if the game is not active.
    if (this.#status !== Tris3dBoard.IS_PLAYING) return false
    // Check that given position is valid.
    const index = Tris3dBoard.POSITION.indexOf(position)
    if (index === -1) return
    // Check that given position is not already taken.
    if (this.#moves.includes(position)) return false
    // Add the move and check if the game has ended.
    this.#moves.push(position)
    if (this.numWinningLines > 0) {
      this.#status = Tris3dBoard.HAS_WINNER
    } else if (this.#moves.length === 27) {
      this.#status = Tris3dBoard.IS_TIE
    }
    return true
  }

  play() {
    if (this.gameIsOver) return
    this.#status = Tris3dBoard.IS_PLAYING
  }
}
