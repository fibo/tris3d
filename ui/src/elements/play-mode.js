import { Client } from '@tris3d/client'
import { define, h } from '../dom.js'

const tagName = 'play-mode'

class Component extends HTMLElement {
  client = new Client()

  connectedCallback() {
    const select = h('select', { id: 'playmode' },
      this.client.playmodes.map(playmode =>
        h(
          'option',
          { value: playmode },
          this.client.translate.playmode(playmode)
        )
      ))

    select.addEventListener('change', this)

    this.client.on({
      playing: (playing) => {
        if (playing !== undefined)
          select.disabled = !!playing
      },

      playmode: (playmode) => {
        select.value = playmode
      }
    })

    this.append(select)
  }

  disconnectedCallback() {
    this.client.dispose()
  }

  handleEvent(event) {
    if (event.type === 'change') {
      this.client.playmode = event.target.value
    }
  }
}

define(tagName, Component)
