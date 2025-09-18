import { peek, publish, subscribe } from '@tris3d/game'
import { define, domComponent, h, hide, show } from '../dom.js'
import { aiStupidLabel, aiSmartLabel, aiBastardLabel, humanLabel, player1Label, player2Label, player3Label } from '../i18n.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'local-players'

styleSheet(
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
      h('option', { value: 'bastard' }, aiBastardLabel)
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
        if (playing) hide(this)
        else show(this)
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
      const previousHumanIndex = previousLocalPlayers.indexOf('human')
      // There must be no more than one human player.
      if (nextChoice === 'human') {
        if (previousHumanIndex !== -1)
          this.select[previousHumanIndex].value = previousChoice
      }
      // AI before human should not be "stupid".
      const localPlayers = this.localPlayers
      const humanIndex = localPlayers.indexOf('human')
      if (humanIndex !== -1) {
        const indexBeforeHuman = humanIndex === 0 ? 2 : humanIndex - 1
        const aiBeforeHuman = localPlayers[indexBeforeHuman]
        const indexAfterHuman = humanIndex === 2 ? 0 : humanIndex + 1
        const aiAfterHuman = localPlayers[indexAfterHuman]
        if (aiBeforeHuman === 'stupid') {
        // If both AIs are "stupid", do nothing.
          if (aiAfterHuman !== 'stupid') {
            // Swap the two AIs.
            this.select[indexBeforeHuman].value = aiAfterHuman
            this.select[indexAfterHuman].value = aiBeforeHuman
          }
        }
      }
      publish('local-players', this.localPlayers)
    }
  }

  get localPlayers() {
    return this.select.map(item => item.value)
  }
}

define(tagName, Component)
