import EventEmitter from 'events'
import { TIMEOUT } from '../lib'
import { Transport } from '../types'

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
    console.log(`inProcessTransport: send ${_eventName}`, args)
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

  return {
    send,
    open,
  }
}
