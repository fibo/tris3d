import { publish } from '@tris3d/pubsub'

export function cannotConnectIfNoNickname(nickname) {
  if (nickname)
    publish('connection_disabled', false)
  else
    publish('connection_disabled', true)
}
