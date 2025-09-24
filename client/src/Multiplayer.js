import { publish, subscribe } from '@tris3d/state'
import { updateMultiplayerAction } from './state/connected.js'
import { updateCurrentPlayer, updateTurn } from './state/moves.js'
import { cannotConnectIfNoNickname } from './state/nickname.js'
import { youWin } from './state/winner_score.js'

export class Multiplayer {
  #subscriptions = []

  enable() {
    publish('connected', false)

    this.#subscriptions.push(
      subscribe('connected', updateMultiplayerAction),
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
