import { publish, subscribe } from '@tris3d/pubsub'
import { playerColor } from '@tris3d/game'

// nickname

subscribe('nickname', (value) => {
  if (!value) return
  localStorage.setItem('nickname', value)
})

const nickname = localStorage.getItem('nickname')
if (nickname !== null)
  publish('nickname', nickname)

// local_players

subscribe('local_players', (value) => {
  if (!value) return
  localStorage.setItem('local_players', JSON.stringify(value))
})

const localPlayers = localStorage.getItem('local_players')
if (localPlayers !== null)
  publish('local_players', JSON.parse(localPlayers))

// player_colors

subscribe('player_colors', (value) => {
  if (!value) return
  const colorNames = value.map(({ colorName }) => colorName)
  localStorage.setItem('player_colors', JSON.stringify(colorNames))
})

const playerColors = localStorage.getItem('player_colors')
if (playerColors !== null) {
  const colorNames = JSON.parse(playerColors)
  publish('player_colors', colorNames.map(
    colorName => ({ colorName, color: playerColor[colorName] })
  ))
}
