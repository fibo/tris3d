import { publish, subscribe } from '@tris3d/state'
import { endGameLabel, quitLabel, startLabel } from '@tris3d/i18n'
import { define, h, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'local-info'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.flexColumn(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  action = h('button', {}, startLabel)
  currentplayer = h('current-player')
  players = h('local-players')
  results = h('local-results')

  connectedCallback() {
    hide(this)

    this.subscriptions.push(
      subscribe('game-over', (gameIsOver) => {
        if (gameIsOver)
          this.action.textContent = endGameLabel
      }),

      subscribe('playing', (playing) => {
        if (playing === true)
          this.action.textContent = quitLabel
        else if (playing === false)
          this.action.textContent = startLabel
      }),

      subscribe('playmode', (playmode) => {
        if (playmode === 'local')
          show(this)
        else if (playmode === 'online')
          hide(this)
      }),
    )

    this.action.addEventListener('click', this)

    this.append(
      this.action,
      this.currentplayer,
      this.players,
      this.results,
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
    this.action.removeEventListener('click', this)
  }

  handleEvent(event) {
    if (event.type === 'click' && event.target === this.action) {
      publish('playing', playing => !playing)
    }
  }
}

define(tagName, Component)
