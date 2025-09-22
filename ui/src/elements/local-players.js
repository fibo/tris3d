import { StateController, i18n } from '@tris3d/client'
import { define, domComponent, h } from '../dom.js'
import { showIfPlaymode } from '../state.js'
import { css, cssRule, styleSheet } from '../style.js'

const tagName = 'local-players'

styleSheet(
  cssRule.hidable(tagName),

  css(tagName, {
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
  })
)

const players = {
  player1: 0,
  player2: 1,
  player3: 2,
}

class Component extends HTMLElement {
  state = new StateController()

  select = Object.keys(players).map(
    player => h('select', { id: player }, [
      'human', 'stupid', 'smart', 'bastard'
    ].map(value =>
      h('option', { value }, i18n.translate(`player.${value}`)
      ))))

  form = h('form', {},
    ['player1', 'player2', 'player3'].map(
      (label, index) => domComponent.field(i18n.transate(label), this.select[index])
    ))

  connectedCallback() {
    this.state.on({
      local_players: (localPlayers) => {
        this.select.forEach((item, index) => {
          const player = localPlayers[index]
          for (const option of item.options)
            if (option.value === player)
              option.selected = true
            else
              option.selected = false
        })
      },

      nickname: (nickname) => {
        this.select.forEach((item) => {
          for (const option of item.options) {
            if (option.value !== 'human')
              continue
            if (nickname)
              option.textContent = nickname
            else
              option.textContent = i18n.translate('player.human')
          }
        })
      },

      playmode: showIfPlaymode('training', this),
    })

    this.select.forEach(item => item.addEventListener('change', this))

    this.append(
      this.form,
    )
  }

  disconnectedCallback() {
    this.select.forEach(item => item.removeEventListener('change', this))
    this.state.dispose()
  }

  handleEvent(event) {
    if (event.type === 'change') {
      this.state.local_players = this.select.map(item => item.value)
    }
  }
}

define(tagName, Component)
