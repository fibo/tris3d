import { publish } from '@tris3d/pubsub'

export function endTrainingGame(gameIsOver) {
  if (gameIsOver)
    publish('action', 'end_game')
}
