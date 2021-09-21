import { QMPortId, Transport } from '../../types'
import { openDgramSocket } from './openDgram'
import { processBuffer } from './processBuffer'

const __: any = {}
export const createInProcessTransport = (): Transport => {
  const name = (id: QMPortId) => id.join('::')

  const open: Transport['open'] = async (id, handler) => {
    __[name(id)] = handler
    return {
      async teardown() {},
    }
  }

  const send: Transport['send'] = async (id, args) => {
    const handler = __[name(id)]
    if (!handler) {
      throw new Error(`port ${name(id)} not available`)
    }
    return handler(...args)
  }

  process.stdin.on('data', buf => processBuffer(send, buf))
  openDgramSocket(send)

  return {
    send,
    open,
  }
}
