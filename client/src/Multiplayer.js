import { publish, subscribe } from '@tris3d/state'
import { updateMultiplayerAction } from './state/connected.js'
import { cannotConnectIfNoNickname } from './state/nickname.js'

export class Multiplayer {
  #subscriptions = []

  enable() {
    publish('connected', false)

    this.#subscriptions.push(
      subscribe('connected', updateMultiplayerAction),
      subscribe('nickname', cannotConnectIfNoNickname),
    )
  }

  disable() {
    this.#subscriptions.forEach(unsubscribe => unsubscribe())
    this.#subscriptions = []
  }
}
