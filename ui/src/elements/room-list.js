import { Client } from '@tris3d/client'
import { define, h } from '../dom.js'

const tagName = 'room-list'

class Component extends HTMLElement {
  client = new Client()

  connectedCallback() {
    const title = h('span', null, this.client.translate.rooms)

    this.append(
      title
    )
  }

  disconnectedCallback() {
    this.client.dispose()
  }
}

define(tagName, Component)
