import { publish, subscribe } from '@tris3d/state'
import { translate } from '@tris3d/i18n'

export class Client {
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

  get translate() {
    return translate('en')
  }

  get actions() {
    return ['start', 'quit', 'end_game']
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
    publish('playmode', value)
  }

  get playmodes() {
    return ['training', 'multiplayer']
  }

  toogglePlaying() {
    publish('playing', value => !value)
  }
}
