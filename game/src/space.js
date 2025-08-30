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
//   /   R   /   Y   /   X   /
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
export const POSITIONS = [
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

export const WINNING_LINES = [
  // Lines parallel to the `x` axis.
  ['A', 'B', 'C'], ['H', 'I', 'D'], ['G', 'F', 'E'],
  ['J', 'K', 'L'], ['Q', '*', 'M'], ['P', 'O', 'N'],
  ['R', 'S', 'T'], ['X', 'Z', 'U'], ['Y', 'W', 'V'],
  // Lines parallel to the `y` axis.
  ['A', 'H', 'G'], ['B', 'I', 'F'], ['C', 'D', 'E'],
  ['J', 'Q', 'P'], ['K', '*', 'O'], ['L', 'M', 'N'],
  ['R', 'X', 'Y'], ['S', 'Z', 'W'], ['T', 'U', 'V'],
  // Lines parallel to the `z` axis.
  ['A', 'J', 'R'], ['H', 'K', 'X'], ['G', 'L', 'Y'],
  ['B', 'Q', 'S'], ['I', '*', 'Z'], ['F', 'M', 'W'],
  ['C', 'P', 'T'], ['D', 'O', 'U'], ['E', 'N', 'V'],
  // Diagonal lines on `z = k` plane.
  ['A', 'I', 'E'], ['C', 'I', 'G'],
  ['J', '*', 'N'], ['L', '*', 'O'],
  ['R', 'Z', 'V'], ['T', 'Z', 'Y'],
  // Diagonal lines on `y = k` plane.
  ['A', 'K', 'Y'], ['G', '*', 'C'],
  ['B', '*', 'W'], ['F', '*', 'D'],
  ['R', '*', 'E'], ['T', '*', 'A'],
  // Diagonal lines on `x = k` plane.
  ['A', 'I', 'V'], ['C', 'M', 'R'],
  ['H', '*', 'U'], ['F', '*', 'T'],
  ['G', 'Q', 'E'], ['L', 'Z', 'C'],
  // Cube diagonals.
  ['A', '*', 'V'], ['C', '*', 'R'],
  ['G', '*', 'T'], ['E', '*', 'Y'],
]

export const VECTOR_OF_POSITION = {
  A: [0, 0, 0],
  B: [0, 1, 0],
  C: [0, 2, 0],
  D: [1, 2, 0],
  E: [2, 2, 0],
  F: [2, 1, 0],
  G: [2, 0, 0],
  H: [1, 0, 0],
  I: [1, 1, 0],
  J: [0, 0, 1],
  K: [0, 1, 1],
  L: [0, 2, 1],
  M: [1, 2, 1],
  N: [2, 2, 1],
  O: [2, 1, 1],
  P: [2, 0, 1],
  Q: [1, 0, 1],
  '*': [1, 1, 1],
  R: [0, 0, 2],
  S: [0, 1, 2],
  T: [0, 2, 2],
  U: [1, 2, 2],
  V: [2, 2, 2],
  W: [2, 1, 2],
  X: [2, 0, 2],
  Y: [1, 0, 2],
  Z: [1, 1, 2],
}
