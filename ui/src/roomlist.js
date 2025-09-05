import { h } from './h.js'

class Roomlist extends HTMLElement {
  title = h('span', null, 'rooms')

  connectedCallback() {
    this.append(
      this.title
    )
  }
}

const tagName = 'room-list'
customElements.get(tagName) || customElements.define(tagName, Roomlist)
