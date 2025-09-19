import { Client } from '@tris3d/client'
import { define, h, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'online-info'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.flexColumn(tagName),
)

class Component extends HTMLElement {
  client = new Client()

  roomList = h('room-list')

  connectedCallback() {
    hide(this)

    this.client.on({
      playmode: (playmode) => {
        if (playmode === 'multiplayer')
          show(this)
        else
          hide(this)
      },
    })

    this.append(
      this.roomList
    )
  }

  disconnectedCallback() {
    this.client.dispose()
  }
}

define(tagName, Component)
