import { StateController, i18n } from '@tris3d/client'
import { aria, define, domComponent, h } from '../dom.js'
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

  playerSelectors = playerIds.map(id => domComponent.select({ id }, [
    'human', 'stupid', 'smart', 'bastard'
  ].map(value =>
    ({ value, label: i18n.translate(`player.${value}`) })
  )))

  winnerIcons = playerIds.map(() => domComponent.icon())
  playerColors = playerIds.map(playerId => domComponent.color(playerId))

  playerFields = playerIds.map((id, i) => {
    const element = domComponent.field(i18n.translate(id), this.playerSelectors[i])
    return Object.assign(element, {
      normalize: () => {
        element.classList.remove(cssClass.playerCurrent)
        element.classList.add(cssClass.fieldFocusable)
      },
      highlight: () => {
        element.classList.add(cssClass.playerCurrent)
        element.classList.remove(cssClass.fieldFocusable)
      },
    })
  })

  connectedCallback() {
    this.state
      .on_current_player_index((playerIndex) => {
        this.playerFields.forEach((item, index) => {
          if (index === playerIndex)
            item.highlight()
          else
            item.normalize()
        })
      })
      .on_local_players((localPlayers) => {
        this.playerSelectors.forEach((item, index) => {
          for (const option of item.options)
            if (option.value === localPlayers[index])
              option.selected = true
            else
              option.selected = false
        })
      })
      .on_nickname((nickname) => {
        this.playerSelectors.forEach((item) => {
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
      .on_player_colors((colors) => {
        this.playerColors.forEach((item, index) => {
          item.setColor(colors[index].color.str)
        })
      })
      .on_playing((playing) => {
        // Toggle enabled/disabled selects on playing.
        this.playerSelectors.forEach((select) => {
          if (playing)
            select.disable()
          else
            select.enable()
        })
        // Toggle enabled/disabled color pickers on playing.
        this.playerColors.forEach((color) => {
          if (playing)
            color.disable()
          else
            color.enable()
        })
        // On stop playing, cleanup.
        if (!playing) {
          this.playerFields.forEach(item => item.normalize())
          this.winnerIcons.forEach(item => item.textContent = '')
        }
      })
      .on_playmode(showIfPlaymode('training', this))
      .on_winner((winner) => {
        this.winnerIcons.forEach((item, index) => {
          if (winner.index === index)
            item.textContent = '🏆'
          else item.textContent = ''
        })
      })

    this.playerColors.forEach(item => item.addEventListener('click', this))

    this.playerSelectors.forEach(item => item.addEventListener('change', this))

    this.append(
      h('form', {},
        playerIds.map((_, i) =>
          h('div', { class: cssClass.flexRow }, [
            this.playerFields[i],
            this.playerColors[i],
            this.winnerIcons[i],
          ])
        )
      )

    )
  }

  disconnectedCallback() {
    this.playerSelectors.forEach(item => item.removeEventListener('change', this))
    this.state.dispose()
  }

  handleEvent(event) {
    if (event.type === 'change' && this.playerSelectors.includes(event.target)) {
      this.state.local_players = this.playerSelectors.map(item => item.value)
    }

    if (event.type === 'click' && this.playerColors.includes(event.target)) {
      if (event.target.getAttribute(aria.disabled)) return
      const index = playerIds.indexOf(event.target.playerId)
      this.state.changePlayerColor(index)
    }
  }
}

define(tagName, Component)
