import { publish, subscribe } from '@tris3d/state'
import { playmodes } from './model.js'

export class StateController {
  #subscriptions = []

  on(listeners) {
    for (const [event, listener] of Object.entries(listeners))
      this.#subscriptions.push(subscribe(event, (value) => {
        if (value === undefined) return
        listener(value)
      }))
  }

  dispose() {
    for (const unsubscribe of this.#subscriptions)
      unsubscribe()
    this.#subscriptions = []
  }

  /** @param {string[]} value */
  set local_players(value) {
    publish('local_players', value)
  }

  /** @param {string} value */
  set nickname(value) {
    publish('nickname', value)
  }

  /** @param {'training' | 'multiplayer'} value */
  set playmode(value) {
    publish('playmode', (previous) => {
      if (value === previous) return
      return value
    })
  }

  get playmodes() {
    return playmodes
  }

  addMove(position) {
    publish('moves', (moves) => {
      if (!moves) return [position]
      return [...moves, position]
    })
  }

  togglePlaying() {
    publish('playing', value => !value)
  }
}
