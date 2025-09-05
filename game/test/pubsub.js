import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { publish, subscribe } from '@tris3d/game'

test('pubsub', () => {
  subscribe('key with no value yet', (value) => {
    assert.equal(value, undefined)
  })

  {
    // Basic pub sub.
    let foo
    subscribe('foo', (value) => {
      assert.equal(value, foo)
    })
    foo = 'bar'
    publish('foo', foo)
  }

  {
    let counter = 0
    let nickname = 'nickname1'
    // Publish nickname
    publish('nickname', nickname)
    // On subscribe, current nickname is sent.
    const unsubscribe = subscribe('nickname', (value) => {
    // Callbacked will be called twice.
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
  }

  {
    publish('list', [1, 2])
    const unsubscribe = subscribe('list', (value) => {
      assert.deepEqual(value, [1, 2])
    })
    // Unsubscribe just for testing.
    unsubscribe()
    // Publish with a function argument.
    publish('list', list => list.concat([3]))
    // Subscrribe again for testing, then unsubscribe immediately.
    subscribe('list', (value) => {
      assert.deepEqual(value, [1, 2, 3])
    })()
  }
})
