import { FastifyInstance } from 'fastify'
import { readFile } from 'fs/promises'
import path from 'path'

export const setupWebSocket = async (fastify: FastifyInstance) => {
  fastify.get('/stream', { websocket: true }, (socket, req) => {
    console.log('Client connected')

    const sendImages = async () => {
      try {
        const imagePath = path.join(__dirname, '../../assets/image.png')
        const imageBuffer = await readFile(imagePath)
        
        for (let i = 0; i < 10; i++) {
          const timestamp = Date.now()
          const data = {
            timestamp,
            image: imageBuffer
          }
          socket.send(JSON.stringify(data))
          console.log(`Image ${i} sent`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error('Error sending images:', error)
      }
    }

    sendImages()

    socket.on('close', () => {
      console.log('Client disconnected')
    })
  })
} 