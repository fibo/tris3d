import { StateController } from '@tris3d/client'
import { define, h } from '../dom.js'
import { showIfPlaymode } from '../state.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'local-info'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.flexColumn(tagName),
)

class Component extends HTMLElement {
  state = new StateController()

  players = h('local-players')
  results = h('local-results')

  connectedCallback() {
    this.state.on({
      playmode: showIfPlaymode('training', this)
    })

    this.append(
      this.players,
      this.results,
    )
  }

  disconnectedCallback() {
    this.state.dispose()
  }
}

define(tagName, Component)
