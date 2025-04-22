import { FastifyInstance } from 'fastify'
import { readFile } from 'fs/promises'
import path from 'path'

type OnCompleteCallback = () => void

export const setupWebSocket = async (
  fastify: FastifyInstance, 
  onComplete?: OnCompleteCallback
) => {
  fastify.get('/stream', { websocket: true }, (socket, req) => {
    console.log('WebSocket: Client connected')
    let imagesSent = 0
    let globalStartTime = 0

    const sendImages = async () => {
      try {
        const imagePath = path.join(__dirname, '../../assets/image.png')
        const imageBuffer = await readFile(imagePath)
        globalStartTime = Date.now()
        
        for (let i = 0; i < 10; i++) {
          const timestamp = Date.now()
          const data = {
            timestamp,
            image: imageBuffer
          }
          socket.send(JSON.stringify(data))
          console.log(`WebSocket: Image ${i + 1} sent`)
          imagesSent++
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        const totalTime = Date.now() - globalStartTime
        console.log(`WebSocket: All images sent. Total time: ${totalTime}ms`)
        
        await new Promise(resolve => setTimeout(resolve, 2000))
        onComplete?.()
      } catch (error) {
        console.error('WebSocket: Error sending images:', error)
      }
    }

    sendImages()

    socket.on('close', () => {
      console.log('WebSocket: Client disconnected')
      if (imagesSent < 10) {
        console.log('WebSocket: Transfer incomplete, not starting gRPC')
      }
    })
  })
} 