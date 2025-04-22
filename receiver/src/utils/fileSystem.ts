import { writeFile, rm, mkdir } from 'fs/promises'
import path from 'path'

export async function cleanAndCreateWebsocketDir() {
  const websocketDir = path.join(__dirname, '../../received/websocket')
  try {
    await rm(websocketDir, { recursive: true, force: true })
    await mkdir(websocketDir, { recursive: true })
    console.log('Websocket directory cleaned and recreated')
    
    await writeFile('/app/output.log', '=== WebSocket Performance Test: 10 Images Transfer ===\n\n', { flag: 'w' })
  } catch (error) {
    console.error('Error cleaning directories:', error)
  }
} 