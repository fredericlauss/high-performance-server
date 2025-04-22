import fastify from 'fastify'
import websocket from '@fastify/websocket'
import { readFile } from 'fs/promises'
import path from 'path'

const server = fastify()

server.register(websocket, {
  options: {
    maxPayload: 1048576,
    clientTracking: true
  }
})

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.register(async function (fastify) {
  fastify.get('/stream', { websocket: true }, (socket, req) => {
    console.log('Client connecté')

    const sendImages = async () => {
      try {
        const imagePath = path.join(__dirname, '../assets/image.png')
        const imageBuffer = await readFile(imagePath)
        
        for (let i = 0; i < 10; i++) {
          socket.send(imageBuffer)
          console.log(`Image ${i} envoyée`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi des images:', error)
      }
    }

    sendImages()

    socket.on('close', () => {
      console.log('Client déconnecté')
    })
  })
})

const start = async () => {
  try {
    await server.listen({ port: 8081 })
    console.log('Server listening at http://localhost:8081')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()