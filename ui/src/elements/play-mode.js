import { StateController, i18n } from '@tris3d/client'
import { define, domComponent, h } from '../dom.js'

const tagName = 'play-mode'

class Component extends HTMLElement {
  state = new StateController()

  select = domComponent.select({ id: 'playmode' },
    this.state.playmodes.map(playmode => ({
      value: playmode,
      label: i18n.translate(`playmode.${playmode}`)
    })))

  connectedCallback() {
    const { select } = this

    select.addEventListener('change', this)

    this.state
      .on_playing((playing) => {
        if (playing)
          select.disable()
        else
          select.enable()
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
