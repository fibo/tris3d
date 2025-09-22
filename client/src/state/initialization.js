import { publish } from '@tris3d/state'
import { defaultLocalPlayers } from '../model.js'

function initialize(key, defaultValue) {
  publish(key, (initalValue) => {
    if (initalValue === undefined) return defaultValue
  })
}

initialize('local_players', defaultLocalPlayers)

initialize('playmode', 'training')
