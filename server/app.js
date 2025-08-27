import { randomUUID } from 'node:crypto'
import { App, us_listen_socket_close } from 'uWebSockets.js'

const PORT = 3456

const app = App()

app.ws('/*', {
  idleTimeout: 60,
  drain: (ws) => {
    console.warn('backpressure' + ws.getBufferedAmount())
  },
  open: (ws) => {
    ws.send(JSON.stringify(ws.info))
  },
  upgrade: (res, req, context) => {
    const encoder = new TextDecoder('utf-8')
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
