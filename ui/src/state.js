import { GameBoard, AI } from '@tris3d/game'
import { publish, subscribe } from '@tris3d/state'
import { humanLabel } from './i18n.js'

// 3D

subscribe('3D', (loaded) => {
  if (loaded)
    publish('playing', false)
})

// local-players

publish('local-players', (storedLocalPlayers) => {
  if (storedLocalPlayers) return
  return ['human', 'stupid', 'stupid']
})

// There must be no more than one human player.
subscribe('local-players', (next, get) => {
  if (!next) return
  if (!next.includes('human')) return
  const previous = get('local-players')
  if (!previous) return
  const previousHumanCount = previous.filter(item => item === 'human').length
  if (previousHumanCount > 1) return
  const previousHumanIndex = previous.indexOf('human')
  if (previousHumanIndex === -1) return

  let nextHumanIndex
  for (let i = 0; i < next.length; i++) {
    const player = next[i]
    if (player === 'human' && i !== previousHumanIndex) {
      nextHumanIndex = i
      break
    }
  }
  if (nextHumanIndex === undefined) return
  // Swap previous human with next human.
  const wanted = [...next]
  wanted[previousHumanIndex] = previous[nextHumanIndex]
  publish('local-players', wanted)
})

// AI before human should not be "stupid".
subscribe('local-players', (next, get) => {
  if (!next) return
  if (!next.includes('human')) return
  const previous = get('local-players')
  if (!previous) return
  const nextHumanCount = next.filter(item => item === 'human').length
  if (nextHumanCount > 1) return
  const nextHumanIndex = next.indexOf('human')
  const indexBeforeHuman = nextHumanIndex === 0 ? 2 : nextHumanIndex - 1
  const aiBeforeHuman = next[indexBeforeHuman]
  const indexAfterHuman = nextHumanIndex === 2 ? 0 : nextHumanIndex + 1
  const aiAfterHuman = next[indexAfterHuman]
  if (aiBeforeHuman === 'stupid') {
  // If both AIs are "stupid", do nothing.
    if (aiAfterHuman !== 'stupid') {
      // Swap the two AIs.
      const wanted = [...next]
      wanted[indexBeforeHuman] = aiAfterHuman
      wanted[indexAfterHuman] = aiBeforeHuman
      publish('local-players', wanted)
    }
  }
})

subscribe('local-players', (localPlayers, get) => {
  const nickname = get('nickname')
  const playerNames = localPlayers.map((player) => {
    if (player === 'human')
      return nickname || humanLabel
    return player
  })
  publish('player-names', playerNames)
})

// moves

subscribe('moves', (moves, get) => {
  if (!moves) return
  const playmode = get('playmode')
  const playing = get('playing')

  const board = new GameBoard(moves)
  if (board.gameIsOver) {
    publish('game-over', true)
    if (board.hasWinner) {
      publish('winner-score', board.numWinningLines)
    }
  }

  if (playing && playmode === 'local') {
    const localPlayers = get('local-players')
    const currentPlayer = localPlayers[board.turnPlayer]
    if (currentPlayer === 'stupid' || currentPlayer === 'smart' || currentPlayer === 'bastard') {
      setTimeout(() => {
        const playing = get('playing')
        if (!playing) return
        const moves = get('moves')
        if (!moves) return
        const board = new GameBoard(moves)
        if (board.gameIsOver) return
        const localPlayers = get('local-players')
        const humanPlayerIndex = localPlayers.indexOf('human')
        const currentPlayer = localPlayers[board.turnPlayer]
        let nextMove
        if (currentPlayer === 'stupid' || currentPlayer === 'smart') {
          nextMove = AI[currentPlayer](moves, humanPlayerIndex)
        }
        if (currentPlayer === 'bastard') {
          nextMove = AI[currentPlayer](moves, humanPlayerIndex)
        }
        if (!nextMove) return
        publish('moves', [...moves, nextMove])
      }, 1000 + Math.random() * 2000)
    }
  }
})

// playing

subscribe('playing', (playing, get) => {
  // Do nothing on initial call.
  if (get('playing') === undefined) return

  if (playing) {
    const playmode = get('playmode')
    if (playmode === 'local') {
      const localPlayers = get('local-players')
      const localPlayerIndex = localPlayers.indexOf('human')
      if (localPlayerIndex > -1) publish('local-player-index', localPlayerIndex)
    }
    publish('moves', [])
  } else {
    publish('game-over', null)
    publish('winner-score', null)
    publish('moves', null)
  }
})

// playmode

publish('playmode', 'local')
