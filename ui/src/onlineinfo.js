import { subscribe } from '@tris3d/game'

import { css } from './css.js'
import { h } from './h.js'

const tagName = 'online-info'

css(
  `${tagName}[hidden] {
    display: none;
  }`
)

class Onlineinfo extends HTMLElement {
  subscriptions = []

  roomList = h('room-list')

  connectedCallback() {
    this.setAttribute('hidden', 'true')

    this.append(
      this.roomList
    )

    this.subscriptions.push(
      subscribe('nickname', (nickname) => {
        if (!nickname) return
        console.log('TODO send nickname', nickname)
      }),

      subscribe('playmode', (playmode) => {
        if (playmode === 'online') {
          this.removeAttribute('hidden')
        } else {
          this.setAttribute('hidden', 'true')
        }
      }),
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }
}

customElements.get(tagName) || customElements.define(tagName, Onlineinfo)
