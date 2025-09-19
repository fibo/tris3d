import { Client } from '@tris3d/client'
import { define, h, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'local-info'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.flexColumn(tagName),
)

class Component extends HTMLElement {
  client = new Client()

  action = h('button', {})
  currentplayer = h('current-player')
  players = h('local-players')
  results = h('local-results')

  connectedCallback() {
    hide(this)

    this.client.on({
      action: (action) => {
        this.action.textContent = this.client.translate.action(action)
      },

      playmode: (playmode) => {
        if (playmode === 'training')
          show(this)
        else if (playmode === 'multiplayer')
          hide(this)
      }
    })

    this.action.addEventListener('click', this)

    this.append(
      this.action,
      this.currentplayer,
      this.players,
      this.results,
    )
  }

  disconnectedCallback() {
    this.client.dispose()
    this.action.removeEventListener('click', this)
  }

  handleEvent(event) {
    if (event.type === 'click' && event.target === this.action) {
      this.client.toogglePlaying()
    }
  }
}

define(tagName, Component)
