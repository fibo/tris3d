import { Client } from '@tris3d/client'
import { currentPlayerLabel, yourTurnMessage } from '@tris3d/i18n'
import { define, domComponent, h, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'current-player'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.message(tagName),
)

class Component extends HTMLElement {
  client = new Client()

  player = h('output', { id: 'current-player', type: 'text' })
  message = domComponent.message()

  connectedCallback() {
    hide(this)

    this.client.on({
      'game-over': (gameIsOver) => {
        if (gameIsOver) hide(this)
      },

      playing: (playing) => {
        if (playing === true) show(this)
        else if (playing === false) hide(this)
      },

      moves: (moves, get) => {
        if (!moves) return

        const players = get('player-names')
        const currentPlayerIndex = moves.length % 3
        const localPlayerIndex = get('local-player-index')

        // player name
        if (typeof currentPlayerIndex === 'number' && players[currentPlayerIndex])
          this.player.textContent = players[currentPlayerIndex]
        else
          this.player.textContent = ''

        // message
        if ((typeof currentPlayerIndex === 'number' && typeof localPlayerIndex === 'number')
          && (localPlayerIndex === currentPlayerIndex))
          this.message.textContent = yourTurnMessage
        else
          this.message.textContent = ''
      }
    })

    this.append(
      domComponent.field(currentPlayerLabel, this.player),
      this.message
    )
  }

  disconnectedCallback() {
    this.client.dispose()
  }
}

define(tagName, Component)
