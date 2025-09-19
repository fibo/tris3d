import { roomsLabel } from '@tris3d/i18n'
import { define, h } from '../dom.js'

const tagName = 'room-list'

class Component extends HTMLElement {
  title = h('span', null, roomsLabel)

  connectedCallback() {
    this.append(
      this.title
    )
  }
}

define(tagName, Component)
