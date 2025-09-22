import { StateController, i18n } from '@tris3d/client'
import { define, domComponent, h } from '../dom.js'
import { showIfPlaymode } from '../state.js'
import { css, cssRule, styleSheet } from '../style.js'

const tagName = 'local-players'

styleSheet(
  cssRule.hidable(tagName),

  css(`${tagName} .player--current`, {
    background: 'var(--mono3)',
    color: 'var(--mono8)',
  }),
  css(`${tagName} .player--current select`, {
    background: 'var(--mono3)',
    'border-color': 'var(--mono3)',
    color: 'var(--mono8)',
  })
)

const players = ['player1', 'player2', 'player3']

class Component extends HTMLElement {
  state = new StateController()

  select = players.map(
    player => h('select', { id: player }, [
      'human', 'stupid', 'smart', 'bastard'
    ].map(value =>
      h('option', { value }, i18n.translate(`player.${value}`)
      ))))

  player = players.map((label, i) =>
    domComponent.field(i18n.translate(label), this.select[i])
  )

  connectedCallback() {
    this.state.on({
      current_player_index: (playerIndex) => {
        this.player.forEach((item, index) => {
          if (index === playerIndex) {
            item.classList.add('player--current')
            item.classList.remove('field--focusable')
          } else {
            item.classList.remove('player--current')
            item.classList.add('field--focusable')
          }
        })
      },

      local_players: (localPlayers) => {
        this.select.forEach((item, index) => {
          for (const option of item.options)
            if (option.value === localPlayers[index])
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

      playing: (playing) => {
        this.select.forEach(item => item.disabled = playing)
      },

      playmode: showIfPlaymode('training', this),
    })

    this.select.forEach(item => item.addEventListener('change', this))

    this.append(
      h('form', {}, this.player)
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
