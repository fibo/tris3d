import { h } from './h.js'

class Multiplayer extends HTMLElement {
  connectButton = h('button', null, 'connect')

  connectedCallback() {
    this.appendChild(this.connectButton)
  }
}

const tagName = 'multi-player'
customElements.get(tagName) || customElements.define(tagName, Multiplayer)
