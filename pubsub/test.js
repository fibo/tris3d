import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { publish, subscribe } from '@tris3d/pubsub'

describe('pubsub', () => {
  test('subscribe before publish', () => {
    subscribe('key with no value yet', (value) => {
      assert.equal(value, undefined)
    })
  })

  test('basic publish and subscribe', () => {
    let counter = 0
    let nickname = 'nickname1'
    // Publish nickname
    publish('nickname', nickname)
    // On subscribe, current nickname is sent.
    const unsubscribe = subscribe('nickname', (value) => {
      // Callback will be called twice.
      counter++
      assert.equal(value, nickname)
    })
    // Publish new nickname
    nickname = 'nickname2'
    publish('nickname', nickname)
    // After unsubscribe, callback won't be called.
    unsubscribe()
    publish('nickname', 'nickname3')
    assert.equal(counter, 2)
  })

  test('publish with value argument and callback argument', () => {
    let counter = 0
    publish('list', [1, 2])
    const unsubscribe = subscribe('list', (value) => {
      counter++
      assert.deepEqual(value, [1, 2])
    })
    // Unsubscribe just for testing.
    unsubscribe()
    // Publish with a function argument.
    publish('list', list => list.concat([3]))
    // Subscribe again for testing, then unsubscribe immediately.
    subscribe('list', (value) => {
      counter++
      assert.deepEqual(value, [1, 2, 3])
    })()
    assert.equal(counter, 2)
  })

  test('subscribe can read previous state value', () => {
    const numbers = [123, 42, -1 / 12]
    let index = -1
    subscribe('number', (value, get) => {
      assert.equal(value, numbers[index], `current value at index ${index}`)
      assert.equal(get('number'), numbers[index - 1], `previous value at index ${index - 1}`)
    })
    for (let num of numbers) {
      index++
      publish('number', num)
    }
  })

  test('subscribe can read other state values', () => {
    publish('value1', 1)
    publish('value2', 2)
    subscribe('value1', (value, get) => {
      assert.equal(value, 1)
      assert.equal(get('value2'), 2)
    })
  })

  test('publish falsy values', () => {
    let expected = 0
    publish('to-be-deleted', expected)
    subscribe('to-be-deleted', (value) => {
      assert.equal(value, expected)
    })
    expected++
    publish('to-be-deleted', value => value + 1)
    expected = null
    publish('to-be-deleted', expected)
    expected = undefined
    publish('to-be-deleted', expected)
  })

  test('publish with callback that return void does not update state', () => {
    let expected = false
    publish('boolean', expected)
    subscribe('boolean', (value) => {
      assert.equal(value, expected)
    })
    expected = !expected
    publish('boolean', value => !value)
    // No return, so state won't be updated.
    publish('boolean', (value) => {
      assert.equal(value, expected)
    })
  })
})
