import { publish } from '@tris3d/state'

export function cannotConnectIfNoNickname(nickname) {
  if (nickname)
    publish('connection_disabled', false)
  else
    publish('connection_disabled', true)
}
