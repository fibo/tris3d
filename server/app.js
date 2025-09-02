import { randomUUID } from 'node:crypto'
import { GameRoom } from '@tris3d/game'
import { App, us_listen_socket_close } from 'uWebSockets.js'

const PORT = 3456

const app = App()
const encoder = new TextDecoder('utf-8')

const room = new GameRoom()

app.ws('/*', {
  idleTimeout: 60,
  drain: (ws) => {
    console.warn('backpressure' + ws.getBufferedAmount())
  },
  message: (ws, message) => {
    const decodedMessage = encoder.decode(message)
    try {
      const { type, data } = JSON.parse(decodedMessage)
      console.info('message', type, data)

      if (type === 'JOIN_ROOM') {
        const { clientId } = data
        room.addClient(clientId)
        return
      }
    } catch (error) {
      console.error(error)
      return
    }
  },
  open: (ws) => {
    ws.send(JSON.stringify({
      type: 'INIT',
      data: {
        sessionId: ws.info.sessionId,
      }
    }))
    ws.subscribe('broadcast')
  },
  upgrade: (res, req, context) => {
    res.upgrade(
      {
        info: {
          remoteAddress: encoder.decode(res.getRemoteAddressAsText()),
          sessionId: randomUUID(),
          url: req.getUrl(),
        }
      },
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'),
      context
    )
  }
})

app.listen(PORT, (listenSocket) => {
  if (!listenSocket) {
    console.error(`Failed to listen on port ${PORT}`)
    process.exit(1)
  }
  console.info(`Server is listening on port ${PORT}`)
  // Handle graceful shutdown.
  const shutdown = () => {
    us_listen_socket_close(listenSocket)
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
})
