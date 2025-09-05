import { subscribe } from '@tris3d/game'

import { css } from './css.js'
import { h } from './h.js'

const tagName = 'local-info'

css(
  `${tagName}[hidden] {
    display: none;
  }`
)

class Localinfo extends HTMLElement {
  subscriptions = []

  players = h('local-players')

  connectedCallback() {
    this.setAttribute('hidden', 'true')

    this.append(
      this.players
    )

    this.subscriptions.push(
      subscribe('playmode', (playmode) => {
        if (playmode === 'local') {
          this.removeAttribute('hidden')
        } else {
          this.setAttribute('hidden', 'true')
        }
      })
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }
}

customElements.get(tagName) || customElements.define(tagName, Localinfo)
