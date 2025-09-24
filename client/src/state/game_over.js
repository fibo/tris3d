import { publish } from '@tris3d/state'

export function endTrainingGame(gameIsOver) {
  if (gameIsOver)
    publish('action', 'end_game')
}
