import { publish, subscribe } from '@tris3d/state'
import { aiStupidLabel, aiSmartLabel, aiBastardLabel, humanLabel, player1Label, player2Label, player3Label } from '@tris3d/i18n'
import { define, domComponent, h, hide, show } from '../dom.js'
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
            if (nickname)
              option.textContent = nickname
            else
              option.textContent = humanLabel
          }
        })
      }),

      subscribe('local-players', (localPlayers) => {
        this.select.forEach((item, index) => {
          const player = localPlayers[index]
          for (const option of item.options)
            if (option.value === player)
              option.selected = true
            else
              option.selected = false
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
      publish('local-players', this.select.map(item => item.value))
    }
  }
}

define(tagName, Component)
