const state = new Map()
const subscribersByKey = new Map()

function update(key, value) {
  // Update state.
  state.set(key, value)
  // Notify subscribers.
  const subscribers = subscribersByKey.get(key)
  if (subscribers)
    for (const callback of subscribers)
      try {
        callback(value)
      } catch (error) {
        console.error(error)
      }
}

export function peek(key) {
  return state.get(key)
}

export function publish(key, arg) {
  if (typeof arg === 'function') {
    // If arg is a function,
    // call it with current value to get new value...
    const currentValue = state.get(key)
    try {
      const newValue = arg(currentValue)
      update(key, newValue)
    } catch (error) {
      console.error(error)
    }
  } else {
    // ...otherwise, arg is the new value.
    update(key, arg)
  }
}

export function subscribe(key, callback) {
  // Add the subscriber.
  const subscribers = subscribersByKey.get(key)
  if (subscribers) {
    subscribers.add(callback)
  } else {
    subscribersByKey.set(key, new Set([callback]))
  }
  // Send snapshot of current state.
  try {
    callback(state.get(key))
  } catch (error) {
    console.error(error)
  }

  // Return unsubscribe function.
  return function unsubscribe() {
    const subscribers = subscribersByKey.get(key)
    subscribers.delete(callback)
  }
}
