import { subscribe } from '@tris3d/game'
import { cssRule, define, field, getDefaultPlayerLabels, h, styles } from './utils.js'

const tagName = 'current-player'

styles(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  subscriptions = []
  currentPlayerIndex = 0

  playerNames = getDefaultPlayerLabels()

  playername = h('output', { id: 'playername', type: 'text' })

  connectedCallback() {
    this.hide()

    this.subscriptions.push(
      subscribe('playing', (playing) => {
        if (playing) this.show()
        else this.hide()
      }),

      subscribe('player-names', (names) => {
        if (names) this.playerNames = names
        this.playername.textContent = this.playerNames[this.currentPlayerIndex]
      }),
    )

    this.append(
      field('current player', this.playername),
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
