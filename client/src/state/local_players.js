import { humanLabel } from '@tris3d/i18n'
import { publish, subscribe } from '@tris3d/state'

// There must be no more than one human player.
subscribe('local_players', (next, get) => {
  if (!next) return
  if (!next.includes('human')) return
  const previous = get('local_players')
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
  publish('local_players', wanted)
})

// AI before human should not be "stupid".
subscribe('local_players', (next, get) => {
  if (!next) return
  if (!next.includes('human')) return
  const previous = get('local_players')
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
      publish('local_players', wanted)
    }
  }
})

subscribe('local_players', (localPlayers, get) => {
  const nickname = get('nickname')
  const playerNames = localPlayers.map((player) => {
    if (player === 'human')
      return nickname || humanLabel
    return player
  })
  publish('player_names', playerNames)
})
