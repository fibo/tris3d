import { publish } from '@tris3d/state'

export function youWin(winner, get) {
  if (!winner) return
  const localPlayerIndex = get('local_player_index')
  publish('you_win', localPlayerIndex === winner.index)
}
