import { StateController } from '@tris3d/client'
import { define, h } from '../dom.js'
import { showIfPlaymode } from '../state.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'online-info'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.flexColumn(tagName),
)

class Component extends HTMLElement {
  state = new StateController()

  roomList = h('room-list')

  connectedCallback() {
    this.state.on_playmode(showIfPlaymode('multiplayer', this))

    this.append(
      this.roomList
    )
  }

  disconnectedCallback() {
    this.state.dispose()
  }
}

define(tagName, Component)
