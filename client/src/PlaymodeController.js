import { publish, subscribe } from '@tris3d/state'
import { updateMultiplayerAction } from './state/connected.js'
import { aiBeforeHuman, noMoreThanOneHuman } from './state/local_players.js'
import { cannotConnectIfNoNickname } from './state/nickname.js'
import { updateTrainingAction } from './state/playing.js'

class Multiplayer {
  #subscriptions = []

  enable() {
    publish('connected', false)

    this.#subscriptions.push(
      subscribe('local_players', aiBeforeHuman),
      subscribe('local_players', noMoreThanOneHuman),
      subscribe('connected', updateMultiplayerAction),
      subscribe('nickname', cannotConnectIfNoNickname),
    )
  }

  disable() {
    this.#subscriptions.forEach(unsubscribe => unsubscribe())
    this.#subscriptions = []
  }
}

class Training {
  #subscriptions = []

  enable() {
    this.#subscriptions.push(
      subscribe('local_players', aiBeforeHuman),
      subscribe('local_players', noMoreThanOneHuman),
      subscribe('playing', updateTrainingAction)
    )
  }

  disable() {
    this.#subscriptions.forEach(unsubscribe => unsubscribe())
    this.#subscriptions = []
  }
}

export class PlaymodeController {
  #mode = {
    multiplayer: new Multiplayer(),
    training: new Training(),
  }

  constructor() {
    subscribe('playmode', (playmode, get) => {
      if (!playmode) return
      const previous = get('playmode')
      if (playmode === previous) return
      if (previous)
        this.#mode[previous].disable()
      this.#mode[playmode].enable()
    })
  }
}
