import { publish } from '@tris3d/state'

function initialize(key, defaultValue) {
  publish(key, (initalValue) => {
    if (initalValue === undefined) return defaultValue
  })
}

initialize('local_players', ['human', 'stupid', 'stupid'])

initialize('playmode', 'training')
