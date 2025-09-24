import { GameBoard, AI } from '@tris3d/game'
import { publish } from '@tris3d/state'

function currentPlayerIndex(moves) {
  if (!moves) return -1
  return moves.length % 3
}

export function checkIfGameIsOver(moves) {
  if (!moves) return
  const board = new GameBoard(moves)
  if (board.gameIsOver) {
    publish('game_over', true)
    if (board.hasWinner)
      publish('winner', {
        index: (moves.length - 1) % 3,
        score: board.numWinningLines
      })
  }
}

export function checkTrainingBoard(moves, get) {
  if (!moves) return
  const board = new GameBoard(moves)
  if (board.gameIsOver) return
  const { turnPlayer } = board
  const localPlayers = get('local_players')
  const humanPlayerIndex = localPlayers.indexOf('human')
  if (turnPlayer === humanPlayerIndex) return
  const currentPlayer = localPlayers[turnPlayer]
  let nextMove
  if (currentPlayer === 'stupid' || currentPlayer === 'smart') {
    nextMove = AI[currentPlayer](moves)
  }
  if (currentPlayer === 'bastard') {
    nextMove = AI[currentPlayer](moves, humanPlayerIndex)
  }
  if (!nextMove) return
  publish('next_training_ai_move', nextMove)
}

export function updateCurrentPlayer(moves) {
  publish('current_player_index', currentPlayerIndex(moves))
}

export function updateTurn(moves, get) {
  publish('your_turn', currentPlayerIndex(moves) === get('local_player_index'))
}
