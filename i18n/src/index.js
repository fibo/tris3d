export const player1Label = 'player 1'
export const player2Label = 'player 2'
export const player3Label = 'player 3'

export const yourTurnMessage = 'it\'s your turn!'

export const currentPlayerLabel = 'current player'
export const gameOverLabel = 'game over'

export const youWinLabel = 'you win! 🏆'
export const extraScoreLabel = 'extra score!!! 🎉'

export const humanLabel = 'human'
export const aiStupidLabel = '🤖 stupid AI'
export const aiSmartLabel = '🤓 smart AI'
export const aiBastardLabel = '😈 bastard AI'

export const nicknameLabel = 'nick name'

export function translate(_lang) {
  return {
    action: (key) => {
      if (key === 'start') return 'start'
      if (key === 'quit') return 'quit'
      if (key === 'end_game') return 'end game'
    },

    playmode: (key) => {
      if (key === 'training') return 'training'
      if (key === 'multiplayer') return 'multi player'
    },

    rooms: 'rooms',
  }
}
