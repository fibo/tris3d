import { peek, publish, subscribe, AI } from '@tris3d/game'
import { getStoredLocalPlayers } from './webStorage.js'

publish('local-players', getStoredLocalPlayers())

subscribe('moves', (moves) => {
  if (!moves) return
  const playmode = peek('playmode')
  const playing = peek('playing')

  if (playing && playmode === 'local') {
    const currentPlayerIndex = moves.length % 3
    const localPlayers = peek('local-players')
    const currentPlayer = localPlayers[currentPlayerIndex]

    if (currentPlayer !== 'human') {
      setTimeout(() => {
        const playing = peek('playing')
        if (!playing) return
        const moves = peek('moves')
        const nextMove = AI[currentPlayer](moves)
        if (!nextMove) return
        publish('moves', [...moves, nextMove])
      }, 1000)
    }
  }
})

subscribe('playing', (playing) => {
  if (playing) {
    const playmode = peek('playmode')
    if (playmode === 'local') {
      const localPlayers = peek('local-players')
      const localPlayerIndex = localPlayers.indexOf('human')
      if (localPlayerIndex > -1) publish('local-player-index', localPlayerIndex)
    }
    publish('moves', [])
  } else {
    publish('moves', undefined)
  }
})
