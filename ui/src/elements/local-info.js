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
    'flex-grow': '1',
    'justify-content': 'space-between',
  }),
)

class Component extends HTMLElement {
  subscriptions = []

  currentplayer = h('current-player')
  players = h('local-players')
  results = h('local-results')
  action = h('button')

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
      this.currentplayer,
      this.players,
      this.results,
      this.action,
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
