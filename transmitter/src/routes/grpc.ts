import * as grpc from '@grpc/grpc-js'
import { readFile } from 'fs/promises'
import path from 'path'
import { ImageTransferClient, ImageData, Ack } from '../proto/image_transfer'

let grpcClient: ImageTransferClient | null = null
let retryCount = 0
const MAX_RETRIES = 5

export const setupGrpc = () => {
  console.log('gRPC: Starting setup...')
  const RECEIVER_URL = process.env.RECEIVER_GRPC_URL || 'localhost:50052'
  console.log('gRPC: Connecting to receiver at:', RECEIVER_URL)
  
  const connectWithRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      console.error('gRPC: Max retries reached, giving up')
      return
    }

    grpcClient = new ImageTransferClient(
      RECEIVER_URL,
      grpc.credentials.createInsecure()
    )

    const stream = grpcClient.transferImages()
    let startTime = 0
    let globalStartTime = 0

    stream.on('error', (error: Error) => {
      console.error('gRPC: Stream error:', error)
      if (error.message.includes('UNAVAILABLE')) {
        retryCount++
        console.log(`gRPC: Retrying connection in 5 seconds... (attempt ${retryCount})`)
        setTimeout(connectWithRetry, 5000)
      }
    })

    const sendImages = async () => {
      try {
        const imagePath = path.join(__dirname, '../../assets/image.png')
        const imageBuffer = await readFile(imagePath)
        globalStartTime = Date.now()
        
        for (let i = 1; i <= 10; i++) {
          startTime = Date.now()
          const imageData: ImageData = {
            timestamp: startTime,
            image: imageBuffer
          }
          
          stream.write(imageData)
          console.log(`gRPC: Sent image ${i}`)
        }
        
        const totalTime = Date.now() - globalStartTime
        console.log(`gRPC: All images sent. Total time: ${totalTime}ms`)
        stream.end()
      } catch (error) {
        console.error('gRPC: Error sending images:', error)
        stream.destroy()
      }
    }

    stream.on('data', (ack: Ack) => {
    })

    stream.on('end', () => {
      console.log('gRPC: Stream ended')
    })

    sendImages()
  }

  connectWithRetry()
  return grpcClient
}

export const closeGrpc = () => {
  if (grpcClient) {
    grpcClient.close()
    grpcClient = null
    console.log('gRPC: Connection closed')
  }
} 