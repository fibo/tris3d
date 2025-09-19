import { subscribe } from '@tris3d/state'
import { extraScoreLabel, gameOverLabel, youWinLabel } from '@tris3d/i18n'
import { define, domComponent, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'local-results'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.message(tagName),
  cssRule.title(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  title = domComponent.title(gameOverLabel)
  winnerMessage = domComponent.message()
  scoreMessage = domComponent.message()

  connectedCallback() {
    hide(this)

    this.subscriptions.push(
      subscribe('game-over', (gameIsOver) => {
        if (gameIsOver)
          show(this)
        else {
          this.winnerMessage.textContent = ''
          hide(this)
        }
      }),

      subscribe('winner-score', (score, get) => {
        const { scoreMessage, winnerMessage } = this

        if (typeof score !== 'number') {
          winnerMessage.textContent = ''
          scoreMessage.textContent = ''
          return
        }

        const moves = get('moves')
        const winnerIndex = (moves.length - 1) % 3
        const localPlayerIndex = get('local-player-index')

        if (localPlayerIndex === winnerIndex)
          winnerMessage.textContent = youWinLabel

        if (score > 1)
          scoreMessage.textContent = extraScoreLabel
      }),
    )

    this.append(
      this.title,
      this.winnerMessage,
      this.scoreMessage,
    )
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }
}

define(tagName, Component)
