import { subscribe } from '@tris3d/game'
import { cssRule, define, h, styles, hide, show } from '../utils.js'

const tagName = 'online-info'

styles(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  roomList = h('room-list')

  connectedCallback() {
    hide(this)

    this.subscriptions.push(
      subscribe('playmode', (playmode) => {
        if (playmode === 'online') show(this)
        else hide(this)
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
