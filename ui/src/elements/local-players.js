import { StateController, i18n } from '@tris3d/client'
import { define, domComponent, h } from '../dom.js'
import { showIfPlaymode } from '../state.js'
import { css, cssClass, cssRule, mono3, mono8, styleSheet } from '../style.js'

const tagName = 'local-players'

styleSheet(
  cssRule.hidable(tagName),

  css(`${tagName} .${cssClass.playerCurrent}`, {
    background: mono3,
    color: mono8,
  }),
  css(`${tagName} .${cssClass.playerCurrent} select`, {
    background: mono3,
    'border-color': mono3,
    color: mono8,
  })
)

const playerIds = ['player1', 'player2', 'player3']

class Component extends HTMLElement {
  state = new StateController()

  selectPlayer = playerIds.map(
    id => h('select', { id }, [
      'human', 'stupid', 'smart', 'bastard'
    ].map(value =>
      h('option', { value }, i18n.translate(`player.${value}`))
    )))

  message = playerIds.map(() => h('span', {}))

  players = playerIds.map((id, i) =>
    domComponent.field(i18n.translate(id), this.selectPlayer[i])
  )

  connectedCallback() {
    this.state
      .on_current_player_index((playerIndex) => {
        this.players.forEach((item, index) => {
          if (index === playerIndex) {
            item.classList.add(cssClass.playerCurrent)
            item.classList.remove(cssClass.fieldFocusable)
          } else {
            item.classList.remove(cssClass.playerCurrent)
            item.classList.add(cssClass.fieldFocusable)
          }
        })
      })
      .on_local_players((localPlayers) => {
        this.selectPlayer.forEach((item, index) => {
          for (const option of item.options)
            if (option.value === localPlayers[index])
              option.selected = true
            else
              option.selected = false
        })
      })
      .on_nickname((nickname) => {
        this.selectPlayer.forEach((item) => {
          for (const option of item.options) {
            if (option.value !== 'human')
              continue
            if (nickname)
              option.textContent = nickname
            else
              option.textContent = i18n.translate('player.human')
          }
        })
      })
      .on_playing((playing) => {
        // Toggle disabled selects on playing.
        this.selectPlayer.forEach(item => item.disabled = playing)
        if (!playing) {
        // Remove highlighted player when not playing.
          this.players.forEach(item =>
            item.classList.remove(cssClass.playerCurrent))
          // Remove all messages.
          this.message.forEach(item => item.textContent = '')
        }
      })
      .on_playmode(showIfPlaymode('training', this))
      .on_winner((winner) => {
        this.message.forEach((item, index) => {
          if (winner.index === index)
            item.textContent = '🏆'
        })
      })

    this.selectPlayer.forEach(item => item.addEventListener('change', this))

    this.append(
      h('form', {},
        playerIds.map((_, i) =>
          h('div', { class: cssClass.flexRow }, [
            this.players[i],
            this.message[i],
          ])
        )
      )

    )
  }

  disconnectedCallback() {
    this.selectPlayer.forEach(item => item.removeEventListener('change', this))
    this.state.dispose()
  }

  handleEvent(event) {
    if (event.type === 'change' && this.selectPlayer.includes(event.target)) {
      this.state.local_players = this.selectPlayer.map(item => item.value)
    }
  }
}

define(tagName, Component)
