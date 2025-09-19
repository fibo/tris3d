import { publish } from '@tris3d/state'

function initialize(key, value) {
  publish(key, (storedValue) => {
    if (storedValue === undefined) return value
  })
}

initialize('local_players', ['human', 'stupid', 'stupid'])

initialize('playmode', 'training')
