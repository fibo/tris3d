import { publish } from '@tris3d/pubsub'
import { defaultLocalPlayers } from '../model.js'

function initialize(key, defaultValue) {
  publish(key, (initalValue) => {
    if (initalValue === undefined) return defaultValue
  })
}

initialize('local_players', defaultLocalPlayers)

initialize('playmode', 'training')
