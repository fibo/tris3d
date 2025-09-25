// Current and previous state.
export const current = new Map()
const previous = new Map()

// Registry of subscribers.
const registry = new Map()

export function update(key, value) {
  // Update state.
  previous.set(key, current.get(key))
  current.set(key, value)
  // Notify subscribers.
  if (registry.has(key))
    for (const callback of registry.get(key))
      invoke(key, callback)
}

export function invoke(subscriptionKey, callback) {
  try {
    callback(current.get(subscriptionKey), (key) => {
      // If key is the same as subscriptionKey, return previous value.
      if (key === subscriptionKey)
        return previous.get(key)
      else
        return current.get(key)
    })
  } catch (error) {
    console.error(error)
  }
}

export function register(key, callback) {
  const subscribers = registry.get(key)
  if (subscribers)
    subscribers.add(callback)
  else
    registry.set(key, new Set([callback]))
}

export function unregister(key, callback) {
  const subscribers = registry.get(key)
  if (subscribers)
    subscribers.delete(callback)
}
