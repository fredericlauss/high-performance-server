import * as grpc from '@grpc/grpc-js'
import { readFile } from 'fs/promises'
import path from 'path'
import { ImageTransferClient, ImageData, Ack } from '../proto/image_transfer'

let grpcClient: ImageTransferClient | null = null
let retryCount = 0
const MAX_RETRIES = 5

export const setupGrpc = () => {
  console.log('Starting gRPC setup...')
  const RECEIVER_URL = process.env.RECEIVER_GRPC_URL || 'localhost:50052'
  console.log('Connecting to receiver at:', RECEIVER_URL)
  
  const connectWithRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      console.error('Max retries reached, giving up')
      return
    }

    grpcClient = new ImageTransferClient(
      RECEIVER_URL,
      grpc.credentials.createInsecure()
    )

    const stream = grpcClient.transferImages()

    stream.on('error', (error: Error) => {
      console.error('Stream error:', error)
      if (error.message.includes('UNAVAILABLE')) {
        retryCount++
        console.log(`Retrying connection in 5 seconds... (attempt ${retryCount})`)
        setTimeout(connectWithRetry, 5000)
      }
    })

    const sendImages = async () => {
      try {
        const imagePath = path.join(__dirname, '../../assets/image.png')
        const imageBuffer = await readFile(imagePath)
        
        for (let i = 1; i <= 10; i++) {
          const imageData: ImageData = {
            timestamp: Date.now(),
            image: imageBuffer
          }
          
          stream.write(imageData)
          console.log(`Sent image ${i}`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        stream.end()
      } catch (error) {
        console.error('Error sending images:', error)
        stream.destroy()
      }
    }

    stream.on('data', (ack: Ack) => {
      console.log('Received ack:', ack)
    })

    stream.on('end', () => {
      console.log('Stream ended')
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
  }
} 