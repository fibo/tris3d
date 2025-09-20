import { StateController } from '@tris3d/client'
import { currentPlayerLabel, yourTurnMessage } from '@tris3d/i18n'
import { define, domComponent, h, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'current-player'

styleSheet(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  state = new StateController()

  player = h('output', { id: 'current-player', type: 'text' })
  message = domComponent.message()

  connectedCallback() {
    hide(this)

    this.state.on({
      current_player_name: (name) => {
        this.player.value = name || ''
      },

      game_over: (gameIsOver) => {
        if (gameIsOver) hide(this)
      },

      playing: (playing) => {
        if (playing) show(this)
        else hide(this)
      },

      your_turn: (isYourTurn) => {
        if (isYourTurn)
          this.message.textContent = yourTurnMessage
        else
          this.message.textContent = ''
      },
    })

    this.append(
      domComponent.field(currentPlayerLabel, this.player),
      this.message
    )
  }

  disconnectedCallback() {
    this.state.dispose()
  }
}

define(tagName, Component)
