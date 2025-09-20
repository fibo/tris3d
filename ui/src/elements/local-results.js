import { StateController } from '@tris3d/client'
import { extraScoreLabel, gameOverLabel, youWinLabel } from '@tris3d/i18n'
import { define, domComponent, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'local-results'

styleSheet(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  state = new StateController()

  title = domComponent.title(gameOverLabel)
  winnerMessage = domComponent.message()
  scoreMessage = domComponent.message()

  connectedCallback() {
    hide(this)

    this.state.on({
      game_over: (gameIsOver) => {
        if (gameIsOver)
          show(this)
        else {
          this.winnerMessage.textContent = ''
          hide(this)
        }
      },

      winner_score: (score) => {
        if (score === 0)
          this.scoreMessage.textContent = ''
        else if (score > 1)
          this.scoreMessage.textContent = extraScoreLabel
      },

      you_win: (youWin) => {
        if (youWin)
          this.winnerMessage.textContent = youWinLabel
        else
          this.winnerMessage.textContent = ''
      }
    })

    this.append(
      this.title,
      this.winnerMessage,
      this.scoreMessage,
    )
  }

  disconnectedCallback() {
    this.state.dispose()
  }
}

define(tagName, Component)
