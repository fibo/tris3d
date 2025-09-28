import { GameBoard, AI } from '@tris3d/game'
import { publish } from '@tris3d/pubsub'

export function checkBoard(moves, get) {
  if (!moves) return
  const board = new GameBoard(moves)
  if (board.gameIsOver) {
    publish('game_over', true)
    if (board.hasWinner)
      publish('winner', {
        index: (moves.length - 1) % 3,
        winningLines: board.winningLines,
      })
  } else {
    publish('current_player_index', board.turnPlayer)
    publish('your_turn', board.turnPlayer === get('local_player_index'))
  }
}

export function getTrainingNextMove(moves, get) {
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
