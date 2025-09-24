import { GameBoard, AI } from '@tris3d/game'
import { publish, subscribe } from '@tris3d/state'

/*
subscribe('moves', (moves, get) => {
  if (!moves) return
  const playmode = get('playmode')
  const playing = get('playing')

  const board = new GameBoard(moves)
  if (board.gameIsOver) {
    publish('game_over', true)
    if (board.hasWinner) {
      publish('winner_score', board.numWinningLines)
    }
  }

  if (playing && playmode === 'training') {
    const localPlayers = get('local_players')
    const currentPlayer = localPlayers[board.turnPlayer]
    if (currentPlayer === 'stupid' || currentPlayer === 'smart' || currentPlayer === 'bastard') {
      setTimeout(() => {
        const playing = get('playing')
        if (!playing) return
        const moves = get('moves')
        if (!moves) return
        const board = new GameBoard(moves)
        if (board.gameIsOver) return
        const localPlayers = get('local_players')
        const humanPlayerIndex = localPlayers.indexOf('human')
        const currentPlayer = localPlayers[board.turnPlayer]
        let nextMove
        if (currentPlayer === 'stupid' || currentPlayer === 'smart') {
          nextMove = AI[currentPlayer](moves, humanPlayerIndex)
        }
        if (currentPlayer === 'bastard') {
          nextMove = AI[currentPlayer](moves, humanPlayerIndex)
        }
        if (!nextMove) return
        publish('moves', [...moves, nextMove])
      }, 1000 + Math.random() * 2000)
    }
  }
})

subscribe('moves', (moves, get) => {
  if (!moves) return
  const currentPlayerIndex = moves.length % 3
  const localPlayerIndex = get('local_player_index')

  if ((typeof currentPlayerIndex === 'number' && typeof localPlayerIndex === 'number')
    && (localPlayerIndex === currentPlayerIndex))
    publish('your_turn', true)
  else
    publish('your_turn', false)
})
*/

function currentPlayerIndex(moves) {
  if (!moves) return -1
  return moves.length % 3
}

export function updateCurrentPlayer(moves) {
  publish('current_player_index', currentPlayerIndex(moves))
}

export function updateTurn(moves, get) {
  publish('your_turn', currentPlayerIndex(moves) === get('local_player_index'))
}
