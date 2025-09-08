import { peek, subscribe } from '@tris3d/game'
import { currentPlayerLabel, yourTurnMessage } from '../i18n.js'
import { css, cssRule, define, field, h, styles } from '../utils.js'

const tagName = 'current-player'

styles(
  cssRule.hidable(tagName),
  css(`${tagName} .message`, {
    padding: 'var(--text-padding)',
  })
)

class Component extends HTMLElement {
  subscriptions = []

  player = h('output', { id: 'current-player', type: 'text' })
  message = h('span', { class: 'message' })

  connectedCallback() {
    this.hide()

    this.subscriptions.push(
      subscribe('playing', (playing) => {
        if (playing) this.show()
        else this.hide()
      }),

      subscribe('moves', (moves) => {
        const { player, message } = this
        if (!moves) return

        const players = peek('player-names')
        const currentPlayerIndex = moves.length % 3
        const localPlayerIndex = peek('local-player-index')

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
      field(currentPlayerLabel, this.player),
      this.message
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
