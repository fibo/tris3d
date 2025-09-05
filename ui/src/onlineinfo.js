import { subscribe } from '@tris3d/game'
import { css, define, h } from './utils.js'

const tagName = 'online-info'

css(
  `${tagName}[hidden] {
    display: none;
  }`
)

class Component extends HTMLElement {
  subscriptions = []

  roomList = h('room-list')

  connectedCallback() {
    this.setAttribute('hidden', 'true')

    this.subscriptions.push(
      subscribe('playmode', (playmode) => {
        if (playmode === 'online') {
          this.removeAttribute('hidden')
        } else {
          this.setAttribute('hidden', 'true')
        }
      }),
    )

    this.append(
      this.roomList
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }
}

define(tagName, Component)
