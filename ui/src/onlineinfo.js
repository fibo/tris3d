import { h } from './h.js'

class Onlineinfo extends HTMLElement {
  roomList = h('room-list', null)

  connectedCallback() {
    this.append(
      this.roomList
    )
  }
}

const tagName = 'online-info'
customElements.get(tagName) || customElements.define(tagName, Onlineinfo)
