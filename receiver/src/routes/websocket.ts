import WebSocket from 'ws'
import { writeFile } from 'fs/promises'
import path from 'path'
import { appendToLog } from '../utils/fileSystem'

let ws: WebSocket | null = null

export const setupWebSocket = () => {
  const TRANSMITTER_URL = process.env.TRANSMITTER_URL || 'ws://localhost:8081/stream'
  
  function connectToTransmitter() {
    ws = new WebSocket(TRANSMITTER_URL)
    let imageCount = 0
    let startTime = 0

    ws.on('open', async () => {
      console.log('WebSocket: Connection established with transmitter')
      startTime = Date.now()
      appendToLog('=== WebSocket performance test: 10 images transfer ===\n\n')
    })

    ws.on('message', async (rawData) => {
      try {
        const receivedAt = Date.now()
        const { timestamp, image } = JSON.parse(rawData.toString())
        const imageBuffer = Buffer.from(image)
        
        const transmissionTime = receivedAt - timestamp
                
        const outputPath = path.join(__dirname, '../../received/websocket', `image-${imageCount}.jpg`)
        
        await writeFile(outputPath, imageBuffer)
        appendToLog(`Image transmission time: ${transmissionTime}ms\n`)
        imageCount++;
        
        if (imageCount === 10) {
          const totalTime = Date.now() - startTime
          const totalMessage = `\nTotal transfer time: ${totalTime}ms\n\n`
          appendToLog(totalMessage)
          console.log(`WebSocket: ${totalMessage}`)
          // ws.close();
        }
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