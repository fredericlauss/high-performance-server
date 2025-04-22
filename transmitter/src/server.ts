import { config } from 'dotenv'
import fastify from 'fastify'
import websocket from '@fastify/websocket'
import fastifyCors from '@fastify/cors'
import { setupWebSocket } from './routes/websocket'

config()

const server = fastify()

server.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true
})

server.register(websocket, {
  options: {
    maxPayload: 1048576,
    clientTracking: true
  }
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.register(setupWebSocket)

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`)
  try {
    const wsServer = server.websocketServer
    if (wsServer) {
      for (const client of wsServer.clients) {
        client.close(1000, 'Server shutting down')
      }
    }
    
    await server.close()
    console.log('Server shut down successfully')
    process.exit(0)
  } catch (err) {
    console.error('Error during shutdown:', err)
    process.exit(1)
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  gracefulShutdown('UNCAUGHT_EXCEPTION')
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason)
  gracefulShutdown('UNHANDLED_REJECTION')
})

const PORT = process.env.PORT || 8081

const start = async () => {
  try {
    await server.listen({ 
      port: parseInt(PORT.toString()), 
      host: '0.0.0.0'
    })
    console.log(`Server listening at http://localhost:${PORT}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()