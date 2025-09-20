export const player1Label = 'player 1'
export const player2Label = 'player 2'
export const player3Label = 'player 3'

export const yourTurnMessage = 'it\'s your turn!'

export const currentPlayerLabel = 'current player'
export const gameOverLabel = 'game over'

export const youWinLabel = 'you win! 🏆'
export const extraScoreLabel = 'extra score!!! 🎉'

export const nicknameLabel = 'nick name'

const translation = {
  en: {
    'action.start': 'start',
    'action.quit': 'quit',
    'action.end_game': 'end game',
    'action.connect': 'connect',

    'playmode.training': 'training',
    'playmode.multiplayer': 'multi player',

    'player.human': 'human',
    'player.stupid': '🤖 stupid AI',
    'player.smart': '🤓 smart AI',
    'player.bastard': '😈 bastard AI',

    rooms: 'rooms',
  }
}

export function translate(lang, key) {
  return translation[lang][key] || key
}
