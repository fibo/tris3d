import { define, h } from '../utils.js'
import { roomsLabel } from '../i18n.js'

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
