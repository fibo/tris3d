import { subscribe } from '@tris3d/game'
import { define, field, h } from './utils.js'

const tagName = 'local-players'

const option1 = selected => h('option', { value: 'human', ...selected }, 'human')
const option2 = selected => h('option', { value: 'stupid', ...selected }, 'AI 🤖')
const option3 = selected => h('option', { value: 'smart', ...selected }, 'AI 🤓')
const option4 = selected => h('option', { value: 'bastard', ...selected }, 'AI 😈')

const getInitialPlayers = () => {
  const defaults = ['human', 'stupid', 'stupid']
  const stored = localStorage.getItem('localplayers')
  try {
    const localplayers = JSON.parse(stored)
    if (Array.isArray(localplayers) && localplayers.length === 3)
      return localplayers
    return defaults
  } catch {
    return defaults
  }
}

const indexOf = {
  player1: 0,
  player2: 1,
  player3: 2,
}

const select = (key) => {
  const players = getInitialPlayers()
  const index = indexOf[key]
  const stored = players[index]
  const selected = { selected: 'true' }
  return h('select', { id: key, name: key }, [
    option1(stored === 'human' ? selected : key === 'player1' ? selected : { }),
    option2(stored === 'stupid' ? selected : key !== 'player1' ? selected : { }),
    option3(stored === 'smart' ? selected : { }),
    option4(stored === 'bastard' ? selected : { }),
  ])
}

class Component extends HTMLElement {
  subscriptions = []

  players = getInitialPlayers()

  select = [
    select('player1'),
    select('player2'),
    select('player3')
  ]

  form = h('form', {}, [
    field('player1', 'player 1', this.select[0]),
    field('player2', 'player 2', this.select[1]),
    field('player3', 'player 3', this.select[2]),
  ])

  connectedCallback() {
    this.select.forEach(item => item.addEventListener('change', this))

    this.subscriptions.push(
      subscribe('nickname', (nickname) => {
        this.select.forEach((item) => {
          for (const option of item.options) {
            if (option.value === 'human') {
              if (nickname) {
                option.textContent = nickname
              } else {
                option.textContent = 'human'
              }
            }
          }
        })
      }),

      subscribe('playing', (playing) => {
        if (playing) {
          this.select.forEach(item => item.disabled = true)
        } else {
          this.select.forEach(item => item.disabled = false)
        }
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
      const previousChoice = this.players[index]
      // There must be no more than one human player.
      if (nextChoice === 'human') {
        const previousHumanIndex = this.players.indexOf('human')
        if (previousHumanIndex !== -1) {
          this.select[previousHumanIndex].value = previousChoice
        }
      }
      // Store choices.
      const players = this.select.map(item => item.value)
      this.players = players
      localStorage.setItem('localplayers', JSON.stringify(players))
    }
  }
}

define(tagName, Component)
