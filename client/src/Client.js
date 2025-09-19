import { subscribe } from '@tris3d/state'

export class Client {
  #subscriptions = []

  on(listeners) {
    for (const [event, listener] of Object.entries(listeners))
      this.#subscriptions.push(subscribe(event, listener))
  }

  dispose() {
    for (const unsubscribe of this.#subscriptions)
      unsubscribe()
    this.#subscriptions = []
  }
}
