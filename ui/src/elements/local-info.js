import { publish, subscribe } from '@tris3d/game'
import { css, cssRule, define, h, styles, show, hide } from '../utils.js'
import { endGameLabel, quitLabel, startLabel } from '../i18n.js'

const tagName = 'local-info'

styles(
  cssRule.hidable(tagName),
  css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: 'var(--gap)',
  }),
)

class Component extends HTMLElement {
  subscriptions = []

  action = h('button')
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
        this.action.textContent = playing ? quitLabel : startLabel
      }),

      subscribe('playmode', (playmode) => {
        if (playmode === 'local') show(this)
        else hide(this)
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
