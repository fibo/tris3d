import { StateController, i18n } from '@tris3d/client'
import { define, h } from '../dom.js'

const tagName = 'play-mode'

class Component extends HTMLElement {
  state = new StateController()

  connectedCallback() {
    const select = h('select', { id: 'playmode' },
      this.state.playmodes.map(playmode =>
        h(
          'option',
          { value: playmode },
          i18n.translate(`playmode.${playmode}`)
        )
      ))

    select.addEventListener('change', this)

    this.state
      .on_playing((playing) => {
        select.disabled = !!playing
      })
      .on_playmode((playmode) => {
        select.value = playmode
      })

    this.append(select)
  }

  disconnectedCallback() {
    this.state.dispose()
  }

  handleEvent(event) {
    if (event.type === 'change') {
      this.state.playmode = event.target.value
    }
  }
}

define(tagName, Component)
