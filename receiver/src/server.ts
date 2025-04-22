import { config } from 'dotenv'
import fastify from 'fastify'
import websocket from '@fastify/websocket'
import fastifyCors from '@fastify/cors'
import { writeFile, rm, mkdir } from 'fs/promises'
import path from 'path'
import WebSocket from 'ws'

config()

const server = fastify()
let ws: WebSocket | null = null

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

async function cleanAndCreateWebsocketDir() {
  const websocketDir = path.join(__dirname, '../received/websocket')
  try {
    await rm(websocketDir, { recursive: true, force: true })
    await mkdir(websocketDir, { recursive: true })
    console.log('Websocket directory cleaned and recreated')
    
    await writeFile('/app/output.log', '=== WebSocket Performance Test: 10 Images Transfer ===\n\n', { flag: 'w' })
  } catch (error) {
    console.error('Error cleaning directories:', error)
  }
}

const PORT = process.env.PORT || 8080
const TRANSMITTER_URL = process.env.TRANSMITTER_URL || 'ws://localhost:8081/stream'

function connectToTransmitter() {
  ws = new WebSocket(TRANSMITTER_URL)
  let imageCount = 1

  ws.on('open', () => {
    console.log('Connection established with transmitter')
  })

  ws.on('message', async (rawData) => {
    try {
      const receivedAt = Date.now()
      const { timestamp, image } = JSON.parse(rawData.toString())
      const imageBuffer = Buffer.from(image)
      
      const transmissionTime = receivedAt - timestamp
      const outputPath = path.join(__dirname, `../received/websocket/image-${imageCount}.jpg`)
      
      await writeFile(outputPath, imageBuffer)
      const logMessage = `Image ${imageCount} Transmission time: ${transmissionTime}ms\n`
      
      await writeFile('/app/output.log', logMessage, { flag: 'a' })
      console.log(logMessage)
      
      imageCount++
    } catch (error) {
      console.error('Error receiving image:', error)
    }
  })

  ws.on('error', (error: Error) => {
    console.error('WebSocket connection error:', error)
  })

  ws.on('close', () => {
    console.log('WebSocket connection closed, trying to reconnect in 5 seconds...')
    setTimeout(connectToTransmitter, 5000)
  })
}

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`)
  try {
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
    await cleanAndCreateWebsocketDir()
    await server.listen({ 
      port: parseInt(PORT.toString()),
      host: '0.0.0.0'
    })
    console.log(`Server listening at http://localhost:${PORT}`)
    connectToTransmitter()
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()