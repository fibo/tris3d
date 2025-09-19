import { publish, subscribe } from '@tris3d/state'

subscribe('game_over', (gameIsOver) => {
  if (gameIsOver) {
    publish('action', 'end_game')
  }
})
