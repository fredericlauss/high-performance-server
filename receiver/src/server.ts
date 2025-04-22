import fastify from 'fastify'
import websocket from '@fastify/websocket'
import { writeFile, rm, mkdir } from 'fs/promises'
import path from 'path'
import WebSocket from 'ws'

const server = fastify()
let ws: WebSocket | null = null

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
  } catch (error) {
    console.error('Error cleaning websocket directory:', error)
  }
}

function connectToTransmitter() {
  ws = new WebSocket('ws://localhost:8081/stream')
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
      console.log(`Image ${imageCount} received and saved:`)
      console.log(`  Sent at: ${new Date(timestamp).toISOString()}`)
      console.log(`  Received at: ${new Date(receivedAt).toISOString()}`)
      console.log(`  Transmission time: ${transmissionTime}ms`)
      
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
    
    await cleanAndCreateWebsocketDir()
    
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
    await server.listen({ port: 8080 })
    console.log('Server listening at http://localhost:8080')
    connectToTransmitter()
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()