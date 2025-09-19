import { publish, subscribe } from '@tris3d/state'

subscribe('playing', (playing, get) => {
  // Do nothing on initial call.
  if (get('playing') === undefined) return

  if (playing) {
    const playmode = get('playmode')
    if (playmode === 'training') {
      const localPlayers = get('local_players')
      const localPlayerIndex = localPlayers.indexOf('human')
      if (localPlayerIndex > -1)
        publish('local_player_index', localPlayerIndex)
    }
    publish('moves', [])
  } else {
    publish('game_over', false)
    publish('winner_score', 0)
  }
})

subscribe('playing', (playing) => {
  if (playing === true)
    publish('action', 'quit')
  else if (playing === false)
    publish('action', 'start')
})
