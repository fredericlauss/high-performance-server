import { writeFile, rm, mkdir } from 'fs/promises'
import path from 'path'

export async function cleanAndCreateDirs() {
  const websocketDir = path.join(__dirname, '../../received/websocket')
  const grpcDir = path.join(__dirname, '../../received/grpc')
  
  try {
    await Promise.all([
      rm(websocketDir, { recursive: true, force: true }),
      rm(grpcDir, { recursive: true, force: true })
    ])
    
    await Promise.all([
      mkdir(websocketDir, { recursive: true }),
      mkdir(grpcDir, { recursive: true })
    ])
    
    console.log('Directories cleaned and recreated')
    
    await writeFile('/app/output.log', '', { flag: 'w' })
  } catch (error) {
    console.error('Error cleaning directories:', error)
  }
}

export async function appendToLog(message: string) {
  try {
    await writeFile('/app/output.log', message, { flag: 'a' })
  } catch (error) {
    console.error('Error writing to log:', error)
  }
} 