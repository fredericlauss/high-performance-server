import * as grpc from '@grpc/grpc-js'
import { writeFile } from 'fs/promises'
import path from 'path'
import { ImageTransferService } from '../proto/image_transfer'
import type { ImageData, Ack } from '../proto/image_transfer'

export const setupGrpc = async () => {
  const server = new grpc.Server()
  
  server.addService(ImageTransferService, {
    transferImages: async (call: grpc.ServerDuplexStream<ImageData, Ack>) => {
      console.log('gRPC: New transmitter connected')
      let imageCount = 0
      
      try {
        call.on('data', async (imageData: ImageData) => {
          const receiveTime = Date.now()
          const transmissionTime = receiveTime - imageData.timestamp
          imageCount++
          
          try {
            const outputPath = path.join(__dirname, '../../received/grpc', `image-${imageData.timestamp}.jpg`)
            await writeFile(outputPath, imageData.image)
            
            console.log(`gRPC: Image ${imageCount} Transmission time: ${transmissionTime}ms`)
            
            const ack: Ack = {
              size: imageData.image.length,
              error: 0
            }
            call.write(ack)
          } catch (error) {
            console.error('gRPC: Error processing image:', error)
            call.write({ size: 0, error: 1 })
          }
        })

        call.on('end', () => {
          call.end()
        })

      } catch (error) {
        console.error('gRPC: Stream error:', error)
        call.destroy()
      }
    }
  })

  return server
}