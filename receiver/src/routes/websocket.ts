import WebSocket from 'ws'
import { writeFile } from 'fs/promises'
import path from 'path'
import { appendToLog } from '../utils/fileSystem'

let ws: WebSocket | null = null

export const setupWebSocket = () => {
  const TRANSMITTER_URL = process.env.TRANSMITTER_URL || 'ws://localhost:8081/stream'
  
  function connectToTransmitter() {
    ws = new WebSocket(TRANSMITTER_URL)
    let imageCount = 1
    let startTime = 0
    let totalTransmissionTime = 0

    ws.on('open', async () => {
      console.log('WebSocket: Connection established with transmitter')
      startTime = Date.now()
      await appendToLog('=== WebSocket performance test: 10 images transfer ===\n\n')
    })

    ws.on('message', async (rawData) => {
      try {
        const receivedAt = Date.now()
        const { timestamp, image } = JSON.parse(rawData.toString())
        const imageBuffer = Buffer.from(image)
        
        const transmissionTime = receivedAt - timestamp
        totalTransmissionTime += transmissionTime
        
        const outputPath = path.join(__dirname, '../../received/websocket', `image-${imageCount}.jpg`)
        
        await writeFile(outputPath, imageBuffer)
        const logMessage = `Image ${imageCount} transmission time: ${transmissionTime}ms\n`
        
        await appendToLog(logMessage)
        console.log(`WebSocket: ${logMessage}`)
        
        if (imageCount === 10) {
          const totalTime = Date.now() - startTime
          const totalMessage = `\nTotal transfer time (including 1s delays): ${totalTime}ms\nSum of transmission times: ${totalTransmissionTime}ms\n\n`
          await appendToLog(totalMessage)
          console.log(`WebSocket: ${totalMessage}`)
        }
        
        imageCount++
      } catch (error) {
        console.error('WebSocket: Error receiving image:', error)
      }
    })

    ws.on('error', (error: Error) => {
      console.error('WebSocket: Connection error:', error)
    })

    ws.on('close', () => {
      console.log('WebSocket: Connection closed, trying to reconnect in 5 seconds...')
      setTimeout(connectToTransmitter, 5000)
    })
  }

  connectToTransmitter()
  return ws
} 