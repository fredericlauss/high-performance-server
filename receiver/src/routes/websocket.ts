import WebSocket from 'ws'
import { writeFile } from 'fs/promises'
import path from 'path'

let ws: WebSocket | null = null

export const setupWebSocket = () => {
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
        const outputPath = path.join(__dirname, '../../received/websocket', `image-${imageCount}.jpg`)
        
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

  connectToTransmitter()
  return ws
} 