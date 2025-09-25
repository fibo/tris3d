import { subscribe } from '@tris3d/pubsub'
import { endTrainingGame } from './state/game_over.js'
import { aiBeforeHuman, noMoreThanOneHuman, setLocalPlayerIndex } from './state/local_players.js'
import { checkIfGameIsOver, checkTrainingBoard, updateCurrentPlayer, updateTurn } from './state/moves.js'
import { resetBoard, updateTrainingAction } from './state/playing.js'
import { youWin } from './state/winner.js'

export class Training {
  #subscriptions = []

  enable() {
    this.#subscriptions.push(
      subscribe('game_over', endTrainingGame),
      subscribe('local_players', setLocalPlayerIndex),
      subscribe('local_players', aiBeforeHuman),
      subscribe('local_players', noMoreThanOneHuman),
      subscribe('moves', checkIfGameIsOver),
      subscribe('moves', checkTrainingBoard),
      subscribe('moves', updateCurrentPlayer),
      subscribe('moves', updateTurn),
      subscribe('playing', updateTrainingAction),
      subscribe('playing', resetBoard),
      subscribe('winnerIndex', youWin),
    )
  }

  disable() {
    this.#subscriptions.forEach(unsubscribe => unsubscribe())
    this.#subscriptions = []
  }
}
