import { subscribe } from '@tris3d/game'
import { css, define, h, styles } from './utils.js'

const tagName = 'local-info'

styles(
  css(`${tagName}[hidden]`, [
    'display: none',
  ])
)

class Component extends HTMLElement {
  subscriptions = []

  players = h('local-players')

  connectedCallback() {
    this.setAttribute('hidden', 'true')

    this.subscriptions.push(
      subscribe('playmode', (playmode) => {
        if (playmode === 'local') {
          this.removeAttribute('hidden')
        } else {
          this.setAttribute('hidden', 'true')
        }
      })
    )

    this.append(
      this.players
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }
}

define(tagName, Component)
