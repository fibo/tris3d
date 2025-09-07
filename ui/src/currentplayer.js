import { subscribe } from '@tris3d/game'
import { css, cssRule, define, field, getDefaultPlayerLabels, h, styles } from './utils.js'

const tagName = 'current-player'
const yourTurnMessage = 'It\'s your turn!'

styles(
  cssRule.hidable(tagName),
  css(`${tagName} .message`, {
    padding: 'var(--text-padding)',
  })
)

class Component extends HTMLElement {
  subscriptions = []
  currentPlayerIndex = 0

  playerNames = getDefaultPlayerLabels()

  playername = h('output', { id: 'playername', type: 'text' })
  message = h('span', { class: 'message' })

  connectedCallback() {
    this.hide()

    this.subscriptions.push(
      subscribe('playing', (playing) => {
        if (playing) this.show()
        else this.hide()
      }),

      subscribe('current-player-index', (index) => {
        this.currentPlayerIndex = index
        if (typeof index === 'number' && index === this.localPlayerIndex) {
          this.message.textContent = yourTurnMessage
        } else {
          this.message.textContent = ''
        }
      }),

      subscribe('local-player-index', (index) => {
        this.localPlayerIndex = index
      }),

      subscribe('player-names', (names) => {
        if (names) this.playerNames = names
        const index = this.currentPlayerIndex
        if (!index) return
        this.playername.textContent = this.playerNames[index]
      }),
    )

    this.append(
      field('current player', this.playername),
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
