import { subscribe } from '@tris3d/state'
import { define, domComponent, h, hide, show } from '../dom.js'
import { currentPlayerLabel, yourTurnMessage } from '../i18n.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'current-player'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.message(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  player = h('output', { id: 'current-player', type: 'text' })
  message = domComponent.message()

  connectedCallback() {
    hide(this)

    this.subscriptions.push(
      subscribe('game-over', (gameIsOver) => {
        if (gameIsOver) hide(this)
      }),

      subscribe('playing', (playing) => {
        if (playing === undefined) return
        if (playing) show(this)
        else hide(this)
      }),

      subscribe('moves', (moves, get) => {
        const { player, message } = this
        if (!moves) return

        const players = get('player-names')
        const currentPlayerIndex = moves.length % 3
        const localPlayerIndex = get('local-player-index')

        // player name
        if (typeof currentPlayerIndex === 'number' && players[currentPlayerIndex])
          player.textContent = players[currentPlayerIndex]
        else
          player.textContent = ''

        // message
        if ((typeof currentPlayerIndex === 'number' && typeof localPlayerIndex === 'number')
          && (localPlayerIndex === currentPlayerIndex))
          message.textContent = yourTurnMessage
        else
          message.textContent = ''
      }),
    )

    this.append(
      domComponent.field(currentPlayerLabel, this.player),
      this.message
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }
}

define(tagName, Component)
