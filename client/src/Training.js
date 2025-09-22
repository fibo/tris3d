import { subscribe } from '@tris3d/state'
import { aiBeforeHuman, noMoreThanOneHuman } from './state/local_players.js'
import { updateTrainingTurn } from './state/moves.js'
import { resetBoard, updateTrainingAction } from './state/playing.js'

export class Training {
  #subscriptions = []

  enable() {
    this.#subscriptions.push(
      subscribe('local_players', aiBeforeHuman),
      subscribe('local_players', noMoreThanOneHuman),
      subscribe('moves', updateTrainingTurn),
      subscribe('playing', updateTrainingAction),
      subscribe('playing', resetBoard),
    )
  }

  disable() {
    this.#subscriptions.forEach(unsubscribe => unsubscribe())
    this.#subscriptions = []
  }
}
