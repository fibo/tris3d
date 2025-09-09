import { peek, subscribe } from '@tris3d/game'
import { cssRule, define, domComponent, styles, show, hide } from '../utils.js'
import { extraScoreLabel, gameOverLabel, youWinLabel } from '../i18n.js'

const tagName = 'local-results'

styles(
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
        if (gameIsOver) show(this)
        else {
          this.winnerMessage.textContent = ''
          hide(this)
        }
      }),

      subscribe('winner-score', (score) => {
        const { scoreMessage, winnerMessage } = this

        if (typeof score !== 'number') {
          winnerMessage.textContent = ''
          scoreMessage.textContent = ''
          return
        }

        const moves = peek('moves')
        const winnerIndex = (moves.length - 1) % 3
        const localPlayerIndex = peek('local-player-index')

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
