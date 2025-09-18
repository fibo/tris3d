import { GameBoard, peek, publish, subscribe, AI } from '@tris3d/game'
import { humanLabel } from './i18n.js'

publish('playing', false)

publish('playmode', 'local')

const localPlayers = peek('local-players')
if (!localPlayers)
  publish('local-players', ['human', 'stupid', 'stupid'])

subscribe('moves', (moves) => {
  if (!moves) return
  const playmode = peek('playmode')
  const playing = peek('playing')

  const board = new GameBoard(moves)
  if (board.gameIsOver) {
    publish('game-over', true)
    if (board.hasWinner) {
      publish('winner-score', board.numWinningLines)
    }
  }

  if (playing && playmode === 'local') {
    const localPlayers = peek('local-players')
    const humanPlayerIndex = localPlayers.indexOf('human')
    const currentPlayer = localPlayers[board.turnPlayer]

    if (currentPlayer !== 'human') {
      setTimeout(() => {
        const playing = peek('playing')
        if (!playing) return
        const moves = peek('moves')
        const board = new GameBoard(moves)
        if (board.gameIsOver) return
        const nextMove = AI[currentPlayer](moves, humanPlayerIndex)
        if (!nextMove) return
        publish('moves', [...moves, nextMove])
      }, 1000 + Math.random() * 2000)
    }
  }
})

subscribe('local-players', (localPlayers) => {
  const nickname = peek('nickname')
  const playerNames = localPlayers.map((player) => {
    if (player === 'human')
      return nickname || humanLabel
    return player
  })
  publish('player-names', playerNames)
})

subscribe('playing', (playing) => {
  publish('game-over', null)
  publish('winner-score', null)

  if (playing) {
    const playmode = peek('playmode')
    if (playmode === 'local') {
      const localPlayers = peek('local-players')
      const localPlayerIndex = localPlayers.indexOf('human')
      if (localPlayerIndex > -1) publish('local-player-index', localPlayerIndex)
    }
    publish('moves', [])
  } else {
    publish('moves', null)
  }
})
