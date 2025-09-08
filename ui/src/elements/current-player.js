import { subscribe } from '@tris3d/game'
import { css, cssRule, define, field, getDefaultPlayerLabels, h, styles } from '../utils.js'

const tagName = 'current-player'

const yourTurnMessage = 'It\'s your turn!'
const currentPlayerLabel = 'Current player'

styles(
  cssRule.hidable(tagName),
  css(`${tagName} .message`, {
    padding: 'var(--text-padding)',
  })
)

class Component extends HTMLElement {
  subscriptions = []
  currentPlayerIndex = 0

  players = getDefaultPlayerLabels()

  player = h('output', { id: 'current-player', type: 'text' })
  message = h('span', { class: 'message' })

  connectedCallback() {
    this.hide()

    this.subscriptions.push(
      subscribe('playing', (playing) => {
        if (playing) this.show()
        else this.hide()
      }),

      subscribe('current-player-index', (index) => {
        this.currentPlayerIndex = index
        this.updateContent()
      }),

      subscribe('local-player-index', (index) => {
        this.localPlayerIndex = index
        this.updateContent()
      }),

      subscribe('player-names', (players) => {
        if (players) this.players = players
        this.updateContent()
      }),
    )

    this.append(
      field(currentPlayerLabel, this.player),
      this.message
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  updateContent() {
    this.updatePlayerName()
    this.updateMessage()
  }

  updateMessage() {
    const { currentPlayerIndex, localPlayerIndex, message } = this
    if (
      (typeof currentPlayerIndex === 'number' && typeof localPlayerIndex === 'number')
      && (localPlayerIndex === currentPlayerIndex)
    ) message.textContent = yourTurnMessage
    else message.textContent = ''
  }

  updatePlayerName() {
    const { player, players, currentPlayerIndex: index } = this
    if (typeof index === 'number' && players[index]) {
      player.textContent = players[index]
    } else {
      player.textContent = ''
    }
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
