import { StateController, i18n } from '@tris3d/client'
import { define, domComponent, hide, show } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'game-results'

styleSheet(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  state = new StateController()

  title = domComponent.title(i18n.translate('game_over'))
  winnerMessage = domComponent.message()

  connectedCallback() {
    hide(this)

    this.state
      .on_game_over((gameIsOver) => {
        if (gameIsOver)
          show(this)
      })
      .on_playing((playing) => {
        if (!playing) {
          this.winnerMessage.textContent = ''
          hide(this)
        }
      })
      .on_you_win((youWin) => {
        if (youWin)
          this.winnerMessage.textContent = i18n.translate('you_win')
        else
          this.winnerMessage.textContent = ''
      })

    this.append(
      this.title,
      this.winnerMessage,
    )
  }

  disconnectedCallback() {
    this.state.dispose()
  }
}

define(tagName, Component)
