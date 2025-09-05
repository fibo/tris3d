import { h } from './h.js'

class Localinfo extends HTMLElement {
  players = h('local-players')

  connectedCallback() {
    this.append(
      this.players
    )
  }
}

const tagName = 'local-info'
customElements.get(tagName) || customElements.define(tagName, Localinfo)
