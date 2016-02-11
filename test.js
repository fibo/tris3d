var test = require('tape')
var tris3d = require('./index')

var coordOf = tris3d.coordinatesOfIndex
var indexOf = tris3d.indexOfCoordinates
var isTris = tris3d.isTris
var semiSum = tris3d.semiSumInZ3xZ3xZ3

// Sorted array of points from point[0] to point[26]
var point = [
  [0, 0, 0], [1, 0, 0], [2, 0, 0], // 0   1   2
  [0, 1, 0], [1, 1, 0], [2, 1, 0], // 3   4   5
  [0, 2, 0], [1, 2, 0], [2, 2, 0], // 6   7   8
  [0, 0, 1], [1, 0, 1], [2, 0, 1], // 9   10  11
  [0, 1, 1], [1, 1, 1], [2, 1, 1], // 12  13  14
  [0, 2, 1], [1, 2, 1], [2, 2, 1], // 15  16  17
  [0, 0, 2], [1, 0, 2], [2, 0, 2], // 18  19  20
  [0, 1, 2], [1, 1, 2], [2, 1, 2], // 21  22  23
  [0, 2, 2], [1, 2, 2], [2, 2, 2]  // 24  25  26
]

test('indexOfCoordinates converts Z3xZ3xZ3 point to 0..26 integer', function (t) {
  for (var i = 0; i < point.length; i++) {
    t.equal(indexOf(point[i]), i, 'index ' + i)
  }

  t.end()
})

test('coordinatesOfIndex converts 0..26 integer to Z3xZ3xZ3 point', function (t) {
  for (var i in point) {
    t.deepEqual(coordOf(i), point[i], 'coordOf ' + i)
  }

  t.end()
})

test('semiSuminZ3xZ3xZ3 returns index of midpoint in Z3 x Z3 x Z3 space', function (t) {
  // TODO test all combinations: how much are they?
  t.equal(semiSum(0, 1), 2)
  t.equal(semiSum(0, 3), 6)
  t.equal(semiSum(1, 5), 6)
  t.equal(semiSum(1, 10), 19)
  t.equal(semiSum(2, 3), 7)
  t.equal(semiSum(3, 4), 5)
  t.equal(semiSum(6, 7), 8)
  t.equal(semiSum(6, 9), 21)
  t.equal(semiSum(9, 10), 11)
  t.equal(semiSum(10, 13), 16)
  t.equal(semiSum(11, 12), 16)
  t.equal(semiSum(12, 13), 14)
  t.equal(semiSum(15, 16), 17)
  t.equal(semiSum(15, 18), 3)
  t.equal(semiSum(17, 18), 4)
  t.equal(semiSum(18, 19), 20)
  t.equal(semiSum(20, 21), 25)
  t.equal(semiSum(21, 22), 23)
  t.equal(semiSum(24, 25), 26)

  t.end()
})

test('semiSuminZ3xZ3xZ3 is simmetric', function (t) {
  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < 27; j++) {
      t.equal(semiSum(i, j), semiSum(j, i))
    }
  }

  t.end()
})

test('semiSuminZ3xZ3xZ3 is cyclic', function (t) {
  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < 27; j++) {
      var k = semiSum(i, j)

      t.equal(semiSum(j, k), i)
      t.equal(semiSum(k, i), j)
    }
  }

  t.end()
})

test('isTris is invariant under permutation or arguments', function (t) {
  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < i; j++) {
      for (var k = 0; k < j; k++) {
        // cyclic
        t.equal(isTris(i, j, k), isTris(j, k, i))
        t.equal(isTris(j, k, i), isTris(k, i, j))

        // transposition
        t.equal(isTris(i, j, k), isTris(j, i, k))
        t.equal(isTris(i, j, k), isTris(i, k, j))
        t.equal(isTris(i, j, k), isTris(k, j, i))
      }
    }
  }

  t.end()
})

test('isTris is false when c is not semiSum of a, b', function (t) {
  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < i; j++) {
      for (var k = 0; k < j; k++) {
        if (k !== semiSum(i, j)) {
          t.notOk(isTris(i, j, k))
        }
      }
    }
  }

  t.end()
})

test('isTris is true when semiSum condition holds and some point is the center', function (t) {
  t.ok(isTris(point[12], point[13], point[14]))
  t.ok(isTris(point[10], point[13], point[16]))

  t.end()
})

test('isTris works properly', function (t) {
  t.ok(isTris(point[0], point[1], point[2]))
  t.notOk(isTris(point[0], point[1], point[3]))
  t.ok(isTris(point[20], point[22], point[24]))

  t.end()
})
