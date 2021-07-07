import { createSocket } from 'dgram'
import { EventEmitter } from 'events'
import { inspect } from 'util'
import { TIMEOUT } from '../../lib'
import { QMPortId, Transport } from '../../types'

export const createInProcessTransport = (): Transport => {
  let reqIdCount = 0

  const emitter = new EventEmitter()

  const eventName = (id: string[]) => id.join('::')

  type Evt = { args: any[]; reqId: string }
  const makeEvent = (args: any[]): Evt => ({ args, reqId: `${reqIdCount++}` })
  const getEvent = (evt: any): Evt => evt

  type Resp = { err: boolean; payload: any }
  const makeResp = (err: boolean, payload: any): Resp => ({ err, payload })
  const getResp = (evt: any): Resp => evt

  const open: Transport['open'] = async (id, handler) => {
    const portHandler = (evt: any) => {
      const { args, reqId } = getEvent(evt)
      handler(...args)
        .then(resp => emitter.emit(reqId, makeResp(false, resp)))
        .catch(err => emitter.emit(reqId, makeResp(true, err)))
    }
    const _eventName = eventName(id)
    emitter.on(_eventName, portHandler)
    return {
      teardown: async () => emitter.off(_eventName, portHandler),
    }
  }

  const send: Transport['send'] = async (id, args, waitsForResponse) => {
    const _eventName = eventName(id)
    const evt = makeEvent(args)
    emitter.emit(_eventName, evt)
    if (waitsForResponse) {
      return new Promise((resolve, reject) => {
        const respHandler = (_resp: any) => {
          const resp = getResp(_resp)
          const _res_rej = resp.err ? reject : resolve
          _res_rej(resp.payload)
        }
        emitter.once(evt.reqId, respHandler)
        setTimeout(() => {
          emitter.off(evt.reqId, respHandler)
          reject(TIMEOUT)
        }, waitsForResponse.timeout)
      })
    }
  }

  process.stdin.on('data', processBufferCmd(send))
  openDgramSocket(send)

  return {
    send,
    open,
  }
}

const openDgramSocket = (send: Transport['send']) => {
  const server = createSocket('udp4')

  server.on('error', err => {
    console.log(`Qmino in-process Transport UDP error: \n${err.stack}`)
    server.close()
  })

  server.on('message', (msg, rinfo) => {
    console.log(`Qmino in-process Transport UDP got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    processBufferCmd(send)(msg)
  })

  server.on('listening', () => {
    const address = server.address()
    console.log(`Qmino in-process Transport UDP listening ${address.address}:${address.port}`)
  })

  server.bind(36715)
}

const STDIN_TAG = 'qmino:'
const processBufferCmd = (send: Transport['send']) => async (buff: Buffer) => {
  const str_in = buff.toString().trim()
  if (!str_in.startsWith(STDIN_TAG)) {
    return
  }
  const [id_str, ...rest] = str_in.replace(STDIN_TAG, '').trim().split('##')
  if (!id_str) {
    return
  }
  console.log({ id_str })
  const args_str = rest.join('##')
  console.log({ args_str })
  try {
    const args = args_str ? JSON.parse(args_str) : []
    console.log('Args:\n', inspect(args))
    console.log('sending...')

    const resp = await send(id_str.split('::') as QMPortId, args, { timeout: 5000 })
    console.log('RESP:\n', inspect(resp))
    return resp
  } catch (err) {
    console.error('ERR:\n', inspect(err))
    throw err
  }
}
