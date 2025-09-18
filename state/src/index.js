import { current, invoke, register, unregister, update } from './internal.js'

export function publish(key, arg) {
  // If arg is not a function, then it is the new value.
  if (typeof arg !== 'function') {
    update(key, arg)
    return
  }
  // If arg is a function,
  // call it with current value to get new value.
  try {
    const newValue = arg(current.get(key))
    // If newValue is undefined, do not update state.
    if (newValue !== undefined)
      update(key, newValue)
  } catch (error) {
    console.error(error)
  }
}

export function subscribe(key, callback) {
  // Send snapshot of current state.
  invoke(key, callback)
  // Add the subscriber.
  register(key, callback)
  // Return unsubscribe function.
  return function unsubscribe() {
    unregister(key, callback)
  }
}
