import { subscribe } from '@tris3d/game'
import { cssRule, define, h, styles } from './utils.js'

const tagName = 'online-info'

styles(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  roomList = h('room-list')

  connectedCallback() {
    this.hide()

    this.subscriptions.push(
      subscribe('playmode', (playmode) => {
        if (playmode === 'online') this.show()
        else this.hide()
      }),
    )

    this.append(
      this.roomList
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
