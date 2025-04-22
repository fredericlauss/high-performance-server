import * as grpc from '@grpc/grpc-js'
import { writeFile } from 'fs/promises'
import path from 'path'
import { ImageTransferService } from '../proto/image_transfer'
import type { ImageData, Ack } from '../proto/image_transfer'
import { appendToLog } from '../utils/fileSystem'

export const setupGrpc = async () => {
  const server = new grpc.Server()
  
  server.addService(ImageTransferService, {
    transferImages: async (call: grpc.ServerDuplexStream<ImageData, Ack>) => {
      console.log('gRPC: New transmitter connected')
      let imageCount = 0
      let startTime = Date.now()
      let totalTransmissionTime = 0
      
      await appendToLog('\n=== gRPC Performance Test: 10 Images Transfer ===\n\n')
      
      try {
        call.on('data', async (imageData: ImageData) => {
          const receiveTime = Date.now()
          const transmissionTime = receiveTime - imageData.timestamp
          totalTransmissionTime += transmissionTime
          imageCount++
          
          try {
            const outputPath = path.join(__dirname, '../../received/grpc', `image-${imageData.timestamp}.jpg`)
            await writeFile(outputPath, imageData.image)
            
            const logMessage = `Image ${imageCount} Transmission time: ${transmissionTime}ms\n`
            await appendToLog(logMessage)
            console.log(`gRPC: ${logMessage}`)
            
            const ack: Ack = {
              size: imageData.image.length,
              error: 0
            }
            call.write(ack)

            if (imageCount === 10) {
              const totalTime = Date.now() - startTime
              const totalMessage = `\nTotal transfer time (including 1s delays): ${totalTime}ms\nSum of transmission times: ${totalTransmissionTime}ms\n\n`
              await appendToLog(totalMessage)
              console.log(`gRPC: ${totalMessage}`)
            }
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