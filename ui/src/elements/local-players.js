import { peek, publish, subscribe } from '@tris3d/game'
import { aiStupidLabel, aiSmartLabel, aiBastardLabel, humanLabel, player1Label, player2Label, player3Label } from '../i18n.js'
import { cssRule, define, domComponent, h, styles } from '../utils.js'

const tagName = 'local-players'

styles(
  cssRule.hidable(tagName),
)

const players = {
  player1: 0,
  player2: 1,
  player3: 2,
}

class Component extends HTMLElement {
  subscriptions = []

  select = Object.keys(players).map(
    player => h('select', { id: player }, [
      h('option', { value: 'human' }, humanLabel),
      h('option', { value: 'stupid' }, aiStupidLabel),
      h('option', { value: 'smart' }, aiSmartLabel),
      h('option', { value: 'bastard', disabled: true }, aiBastardLabel)
    ])
  )

  form = h('form', {},
    [player1Label, player2Label, player3Label].map(
      (label, index) => domComponent.field(label, this.select[index])
    ))

  connectedCallback() {
    this.select.forEach(item => item.addEventListener('change', this))

    this.subscriptions.push(
      subscribe('nickname', (nickname) => {
        this.select.forEach((item) => {
          for (const option of item.options) {
            if (option.value !== 'human')
              continue
            if (nickname) option.textContent = nickname
            else option.textContent = humanLabel
          }
        })
      }),

      subscribe('local-players', (localPlayers) => {
        this.select.forEach((item, index) => {
          const player = localPlayers[index]
          for (const option of item.options) {
            if (option.value === player) option.selected = true
            else option.selected = false
          }
        })
      }),

      subscribe('playing', (playing) => {
        if (playing) this.hide()
        else this.show()
      }),
    )

    this.append(
      this.form,
    )
  }

  disconnectedCallback() {
    this.select.forEach(item => item.removeEventListener('change', this))

    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  handleEvent(event) {
    if (event.type === 'change') {
      const key = event.target.id
      const index = players[key]
      const nextChoice = event.target.value
      const previousLocalPlayers = peek('local-players')
      const previousChoice = previousLocalPlayers[index]
      // There must be no more than one human player.
      if (nextChoice === 'human') {
        const previousHumanIndex = previousLocalPlayers.indexOf('human')
        if (previousHumanIndex !== -1) {
          this.select[previousHumanIndex].value = previousChoice
        }
      }
      const localPlayers = this.select.map(item => item.value)
      publish('local-players', localPlayers)
    }
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
