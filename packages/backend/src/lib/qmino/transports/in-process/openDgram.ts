import { createSocket } from 'dgram'
import { Transport } from '../../types'
import { processBuffer } from './processBuffer'

export const openDgramSocket = (send: Transport['send']) => {
  const server = createSocket('udp4')

  server.on('error', err => {
    console.log(`Qmino in-process Transport UDP error: \n${err.stack}`)
    server.close()
  })

  server.on('message', (msg, rinfo) => {
    console.log(`Qmino in-process Transport UDP got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    processBuffer(send, msg)
  })

  server.on('listening', () => {
    const address = server.address()
    console.log(`Qmino in-process Transport UDP listening ${address.address}:${address.port}`)
  })

  server.bind(36715)
}
