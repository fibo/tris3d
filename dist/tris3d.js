require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"tris3d":[function(require,module,exports){
/**
 * Check if three points form a tris
 *
 * This is the core algorithm of tris3d
 *
 * @param {Array} a
 * @param {Array} b
 * @param {Array} c
 *
 * @returns {Boolean} response
 */

function isTris (a, b, c) {
  var indexOfCenter = indexOfCoordinates([1, 1, 1])
  var indexOfA = indexOfCoordinates(a)
  var indexOfB = indexOfCoordinates(b)
  var indexOfC = indexOfCoordinates(c)
  var indexOfP

  // Let T = {a, b, c} be a tern of points.
  //
  // A necessary condition to be a tris is
  //
  //     semiSum(a, b) = c
  //
  // Since semiSum is cyclic, I can choose a, b, c in any order.
  if (semiSumInZ3xZ3xZ3(indexOfA, indexOfB) !== indexOfC) {
    return false
  }

  // If any point is the center, then T it is a tris.
  if ((indexOfCenter === indexOfA) || (indexOfCenter === indexOfB) || (indexOfCenter === indexOfC)) {
    return true
  }

  // Now, if it exists an index k where A_k = B_k
  // let be a point P where P_h = 1 for every k != h,
  // in other words P is the center of a face.
  if (a[0] === b[0]) {
    indexOfP = indexOfCoordinates([a[0], 1, 1])
  }

  if (a[1] === b[1]) {
    indexOfP = indexOfCoordinates([1, a[1], 1])
  }

  if (a[2] === b[2]) {
    indexOfP = indexOfCoordinates([1, 1, a[2]])
  }

  // If there exists indexes k, h where
  // A_k = B_k, A_h = B_h
  // then T is a tris.
  if ((a[0] === b[0]) && (a[1] === b[1])) {
    return true
  }

  if ((a[0] === b[0]) && (a[2] === b[2])) {
    return true
  }

  if ((a[1] === b[1]) && (a[2] === b[2])) {
    return true
  }

  // If T contains P, then it is a tris.
  if ((indexOfP === indexOfA) || (indexOfP === indexOfB) || (indexOfP === indexOfC)) {
    return true
  }

  // All other cases are not a tris.
  // In particular there are some terns,for example, U = {0, 5, 7}
  // for which the semiSum condition holds but they are not a tris.
  return false
}

exports.isTris = isTris

/**
 * Semisum operator in Z3 x Z3 x Z3 space
 *
 * Z3 is the group of arithmetic modulo 3.
 * Note that in Z3, mutliply and divide by 2 has the same result: in deed
 *
 * ```
 * 0 -> 0
 * 1 -> 2
 * 2 -> 1
 * ```
 *
 * So, in Z3
 *
 * ```
 * (a + b) * 2 = (a + b) / 2
 * ```
 *
 * Since I'm working with integers I prefer to multiply by 2 to avoid floats.

 * Z3xZ3xZ3 is the cartesian product of Z3, seen as a 3 dimensional space immersed in R3.
 *
 *
 * @param {Number} index1
 * @param {Number} index2
 *
 * @return {Number} index
 */

function semiSumInZ3xZ3xZ3 (index1, index2) {
  var point1 = coordinatesOfIndex(index1)
  var point2 = coordinatesOfIndex(index2)

  var x = ((point1[0] + point2[0]) * 2) % 3
  var y = ((point1[1] + point2[1]) * 2) % 3
  var z = ((point1[2] + point2[2]) * 2) % 3

  return indexOfCoordinates([x, y, z])
}

exports.semiSumInZ3xZ3xZ3 = semiSumInZ3xZ3xZ3

/**
 * Convert point in Z3xZ3xZ3 to index
 *
 * @param {Array} coordinates
 *
 * @returns {Number} index
 */

function indexOfCoordinates (point) {
  return point[0] + 3 * point[1] + 9 * point[2]
}

exports.indexOfCoordinates = indexOfCoordinates

/**
 * Convert index to point in Z3xZ3xZ3
 *
 * @param {Number} index
 *
 * @returns {Array} coordinates
 */

function coordinatesOfIndex (index) {
  var x = index % 3
  var y = ((index - x) % 9) / 3
  var z = (index - x - (3 * y)) / 9

  return [x, y, z]
}

exports.coordinatesOfIndex = coordinatesOfIndex

},{}]},{},[]);
