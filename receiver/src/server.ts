import { config } from 'dotenv'
import fastify from 'fastify'
import websocket from '@fastify/websocket'
import fastifyCors from '@fastify/cors'
import { setupWebSocket } from './routes/websocket'
import { setupGrpc } from './routes/grpc'
import * as grpc from '@grpc/grpc-js'
import { cleanAndCreateDirs } from './utils/fileSystem'
import WebSocket from 'ws'

config()

const server = fastify()
let ws: WebSocket | null = null
let grpcServer: grpc.Server | null = null

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

const PORT = process.env.PORT || 8080
const GRPC_PORT = process.env.GRPC_PORT || 50052

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`)
  try {
    if (grpcServer) {
      await new Promise<void>((resolve) => {
        grpcServer!.tryShutdown(() => {
          console.log('gRPC server shut down successfully')
          resolve()
        })
      })
    }
    
    if (ws) {
      ws.close(1000, 'Receiver shutting down')
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

const start = async () => {
  try {
    await cleanAndCreateDirs()
    await server.listen({ 
      port: parseInt(PORT.toString()),
      host: '0.0.0.0'
    })
    console.log(`Server listening at http://localhost:${PORT}`)
    ws = setupWebSocket()
    
    grpcServer = await setupGrpc()
    grpcServer.bindAsync(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error('Failed to bind gRPC server:', err)
          return
        }
        grpcServer!.start()
        console.log(`gRPC server listening on port ${port}`)
      }
    )
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()