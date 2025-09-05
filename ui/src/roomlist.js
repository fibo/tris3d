import { define, h } from './utils.js'
const tagName = 'room-list'

class Component extends HTMLElement {
  title = h('span', null, 'rooms')

  connectedCallback() {
    this.append(
      this.title
    )
  }
}

define(tagName, Component)
