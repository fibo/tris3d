import { publish, subscribe } from '@tris3d/state'
import { playmodes } from './model.js'

export class StateController {
  #subscriptions = []

  #on(listeners) {
    for (const [event, listener] of Object.entries(listeners))
      this.#subscriptions.push(subscribe(event, (value) => {
        if (value === undefined) return
        listener(value)
      }))
    return this
  }

  dispose() {
    for (const unsubscribe of this.#subscriptions)
      unsubscribe()
    this.#subscriptions = []
  }

  on_action(listener) { return this.#on({ action: listener }) }
  on_connected(listener) { return this.#on({ connected: listener }) }
  on_connection_disabled(listener) { return this.#on({ connection_disabled: listener }) }
  on_current_player_index(listener) { return this.#on({ current_player_index: listener }) }
  on_game_over(listener) { return this.#on({ game_over: listener }) }
  on_local_players(listener) { return this.#on({ local_players: listener }) }
  on_moves(listener) { return this.#on({ moves: listener }) }
  on_nickname(listener) { return this.#on({ nickname: listener }) }
  on_playing(listener) { return this.#on({ playing: listener }) }
  on_playmode(listener) { return this.#on({ playmode: listener }) }
  on_winner_score(listener) { return this.#on({ winner_score: listener }) }
  on_you_win(listener) { return this.#on({ you_win: listener }) }
  on_your_turn(listener) { return this.#on({ your_turn: listener }) }

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
