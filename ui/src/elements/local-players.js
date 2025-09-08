import { peek, publish, subscribe } from '@tris3d/game'
import { getDefaultPlayerLabels, aiStupidLabel, aiSmartLabel, aiBastardLabel, humanLabel } from '../i18n.js'
import { getStoredLocalPlayers } from '../webStorage.js'
import { cssRule, define, field, h, styles } from '../utils.js'

const tagName = 'local-players'

styles(
  cssRule.hidable(tagName),
)

const option1 = selected => h('option', { value: 'human', ...selected }, humanLabel)
const option2 = selected => h('option', { value: 'stupid', ...selected }, aiStupidLabel)
const option3 = selected => h('option', { value: 'smart', ...selected }, aiSmartLabel)
const option4 = selected => h('option', { value: 'bastard', ...selected }, aiBastardLabel)

const defaultPlayerLabels = getDefaultPlayerLabels()

const indexOf = {
  player1: 0,
  player2: 1,
  player3: 2,
}

const initialPlayers = getStoredLocalPlayers()

const select = (id) => {
  const index = indexOf[id]
  const stored = initialPlayers[index]
  const selected = { selected: 'true' }
  return h('select', { id, name: id }, [
    option1(stored === 'human' ? selected : id === 'player1' ? selected : { }),
    option2(stored === 'stupid' ? selected : id !== 'player1' ? selected : { }),
    option3(stored === 'smart' ? selected : { }),
    option4(stored === 'bastard' ? selected : { }),
  ])
}

class Component extends HTMLElement {
  subscriptions = []

  select = [
    select('player1'),
    select('player2'),
    select('player3')
  ]

  form = h('form', {}, defaultPlayerLabels.map(
    (label, index) => field(label, this.select[index])
  ))

  connectedCallback() {
    this.select.forEach(item => item.addEventListener('change', this))

    this.subscriptions.push(
      subscribe('nickname', (nickname) => {
        this.select.forEach((item) => {
          for (const option of item.options)
            if (option.value === 'human') {
              if (nickname) option.textContent = nickname
              else option.textContent = humanLabel
            }
        })
        this.publishInfo()
      }),

      subscribe('playing', (playing) => {
        if (playing) this.hide()
        else this.show()
      }),
    )

    this.append(this.form)
  }

  disconnectedCallback() {
    this.select.forEach(item => item.removeEventListener('change', this))

    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  handleEvent(event) {
    if (event.type === 'change') {
      const key = event.target.id
      const index = indexOf[key]
      const nextChoice = event.target.value
      const localPlayers = peek('local-players')
      const previousChoice = localPlayers[index]
      // There must be no more than one human player.
      if (nextChoice === 'human') {
        const previousHumanIndex = localPlayers.indexOf('human')
        if (previousHumanIndex !== -1) {
          this.select[previousHumanIndex].value = previousChoice
        }
      }
      this.publishInfo()
    }
  }

  publishInfo() {
    const localPlayers = this.select.map(item => item.value)
    publish('local-players', localPlayers)

    const playerNames = this.select.map(
      (item, index) => {
        const playerName = item.options[item.selectedIndex].textContent
        // If local player has no nickname, use player label.
        if (playerName === humanLabel) return defaultPlayerLabels[index]
        return playerName
      }
    )
    publish('player-names', playerNames)
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
