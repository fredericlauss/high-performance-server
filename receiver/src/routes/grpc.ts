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
      let startTime = 0
      let totalTransmissionTime = 0
            
      try {
        call.on('data', async (imageData: ImageData) => {
          if (imageCount === 0) {
            startTime = Date.now()
            appendToLog('\n=== gRPC performance test: 10 images transfer ===\n\n')
          }
          
          const receiveTime = Date.now()
          const transmissionTime = receiveTime - imageData.timestamp
          totalTransmissionTime += transmissionTime
          imageCount++
          
          try {
            const outputPath = path.join(__dirname, '../../received/grpc', `image-${imageCount}.jpg`)
            await writeFile(outputPath, imageData.image)
            
            const logMessage = `Image ${imageCount} transmission time: ${transmissionTime}ms\n`
            appendToLog(logMessage)
            console.log(`gRPC: ${logMessage}`)
            
            const ack: Ack = {
              size: imageData.image.length,
              error: 0
            }
            call.write(ack)

            if (imageCount === 10) {
              setTimeout(() => {
                const totalTime = Date.now() - startTime
                const totalMessage = `\nTotal transfer time: ${totalTime}ms\nSum of transmission times: ${totalTransmissionTime}ms\n\n`
                appendToLog(totalMessage)
                console.log(`gRPC: ${totalMessage}`)
              }, 100)
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