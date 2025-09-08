import { publish, subscribe } from '@tris3d/game'
import { getStoredLocalPlayers, setStoredLocalPlayers } from '../webStorage.js'
import { cssRule, define, field, getDefaultPlayerLabels, h, styles } from '../utils.js'

const tagName = 'local-players'

styles(
  cssRule.hidable(tagName),
)

const humanLabel = 'human'

const option1 = selected => h('option', { value: 'human', ...selected }, humanLabel)
const option2 = selected => h('option', { value: 'stupid', ...selected }, 'AI 🤖')
const option3 = selected => h('option', { value: 'smart', ...selected }, 'AI 🤓')
const option4 = selected => h('option', { value: 'bastard', ...selected }, 'AI 😈')

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

  localPlayers = initialPlayers

  select = [
    select('player1'),
    select('player2'),
    select('player3')
  ]

  form = h('form', {}, defaultPlayerLabels.map(
    (label, index) => field(label, this.select[index])
  ))

  get playerNames() {
    return this.select.map(
      (item, index) => {
        const playerName = item.options[item.selectedIndex].textContent
        // If local player has no nickname, use player label.
        if (playerName === humanLabel) return defaultPlayerLabels[index]
        return playerName
      }
    )
  }

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
        publish('player-names', this.playerNames)
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
      const previousChoice = this.localPlayers[index]
      // There must be no more than one human player.
      if (nextChoice === 'human') {
        const previousHumanIndex = this.localPlayers.indexOf('human')
        if (previousHumanIndex !== -1) {
          this.select[previousHumanIndex].value = previousChoice
        }
      }
      // Store choices.
      this.localPlayers = this.select.map(item => item.value)
      setStoredLocalPlayers(this.localPlayers)
      // Publish players info.
      publish('player-names', this.playerNames)
      publish('local-player-index', this.localPlayers.indexOf('human'))
    }
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
