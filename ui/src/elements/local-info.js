import { publish, subscribe } from '@tris3d/game'
import { css, cssRule, define, h, styles } from '../utils.js'

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
  action = h('button')

  connectedCallback() {
    this.hide()

    this.subscriptions.push(
      subscribe('playing', (playing) => {
        this.action.textContent = playing ? 'quit' : 'start'
      }),

      subscribe('playmode', (playmode) => {
        if (playmode === 'local') this.show()
        else this.hide()
      }),
    )

    this.action.addEventListener('click', this)

    this.append(
      this.currentplayer,
      this.players,
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

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
