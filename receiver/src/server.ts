import fastify from 'fastify'
import websocket from '@fastify/websocket'
import { writeFile, rm, mkdir } from 'fs/promises'
import path from 'path'
import WebSocket from 'ws'

const server = fastify()

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
    console.log('Dossier websocket nettoyé et recréé')
  } catch (error) {
    console.error('Erreur lors du nettoyage du dossier websocket:', error)
  }
}

function connectToTransmitter() {
  const ws = new WebSocket('ws://localhost:8081/stream')
  let imageCount = 1

  ws.on('open', () => {
    console.log('Connexion établie avec le transmitter')
  })

  ws.on('message', async (data: Buffer) => {
    try {
      const outputPath = path.join(__dirname, `../received/websocket/image-${imageCount}.jpg`)
      await writeFile(outputPath, data)
      console.log(`Image ${imageCount} reçue et sauvegardée`)
      imageCount++
    } catch (error) {
      console.error('Erreur lors de la réception de l\'image:', error)
    }
  })

  ws.on('error', (error: Error) => {
    console.error('Erreur de connexion WebSocket:', error)
  })

  ws.on('close', () => {
    console.log('Connexion WebSocket fermée, tentative de reconnexion dans 5 secondes...')
    setTimeout(connectToTransmitter, 5000)
  })
}

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