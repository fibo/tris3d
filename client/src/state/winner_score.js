import { publish, subscribe } from '@tris3d/state'

subscribe('winner_score', (score, get) => {
  if (!score) return
  const moves = get('moves')
  const winnerIndex = (moves.length - 1) % 3
  const localPlayerIndex = get('local_player_index')
  if (localPlayerIndex === winnerIndex)
    publish('you_win', true)
  else
    publish('you_win', false)
})
