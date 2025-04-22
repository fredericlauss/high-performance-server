import * as grpc from '@grpc/grpc-js'
import { writeFile } from 'fs/promises'
import path from 'path'
import { ImageTransferService } from '../proto/image_transfer'
import type { ImageData, Ack } from '../proto/image_transfer'

export const setupGrpc = async () => {
  const server = new grpc.Server()
  
  server.addService(ImageTransferService, {
    transferImages: async (call: grpc.ServerDuplexStream<ImageData, Ack>) => {
      console.log('gRPC transmitter connected')
      
      try {
        call.on('data', async (imageData: ImageData) => {
          console.log('Received image, timestamp:', imageData.timestamp)
          
          try {
            const outputPath = path.join(__dirname, '../../received/grpc', `image-${imageData.timestamp}.jpg`)
            await writeFile(outputPath, imageData.image)
            
            const ack: Ack = {
              size: imageData.image.length,
              error: 0
            }
            call.write(ack)
            console.log('Sent ack:', ack)
          } catch (error) {
            console.error('Error processing image:', error)
            call.write({ size: 0, error: 1 })
          }
        })

        call.on('end', () => {
          console.log('Transmitter ended stream')
          call.end()
        })

      } catch (error) {
        console.error('Stream error:', error)
        call.destroy()
      }
    }
  })

  return server
}