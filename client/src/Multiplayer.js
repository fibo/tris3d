import { publish, subscribe } from '@tris3d/pubsub'
import { updateMultiplayerAction } from './state/connected.js'
import { checkIfGameIsOver, updateCurrentPlayer, updateTurn } from './state/moves.js'
import { cannotConnectIfNoNickname } from './state/nickname.js'
import { youWin } from './state/winner.js'

export class Multiplayer {
  #subscriptions = []

  enable() {
    publish('connected', false)

    this.#subscriptions.push(
      subscribe('connected', updateMultiplayerAction),
      subscribe('moves', checkIfGameIsOver),
      subscribe('moves', updateCurrentPlayer),
      subscribe('moves', updateTurn),
      subscribe('nickname', cannotConnectIfNoNickname),
      subscribe('winnerIndex', youWin),
    )
  }

  disable() {
    this.#subscriptions.forEach(unsubscribe => unsubscribe())
    this.#subscriptions = []
  }
}
