import { Domain, DomainApiMap } from '@mn-be/domain/types'
import { EventEmitter } from 'events'
import { IdentifiedDomainEvent, MsgTransport } from '../types'

const DEF_API_TO = 5000
const DEF_EVT_NAME = '*'

const _id = () => Math.random().toString(36).substring(2)

type Opts = { logger?(_: IdentifiedDomainEvent<any, any>): unknown }
type Cfg = { apiTimeout?: number }

export const make = ({ apiTimeout = DEF_API_TO }: Cfg, { logger = () => {} }: Opts) => {
  const emitter = new EventEmitter()

  const subAll = (handler: (event: IdentifiedDomainEvent<any, any>) => unknown) => {
    emitter.addListener(DEF_EVT_NAME, handler)
    return () => emitter.removeListener(DEF_EVT_NAME, handler)
  }

  const pub: MsgTransport<any>['pub'] = (event) => {
    const id = _id()

    const idEvent: IdentifiedDomainEvent<any, any> = {
      ...event,
      id,
    }
    emitter.emit(DEF_EVT_NAME, idEvent)
    logger(idEvent)
    return idEvent
  }

  const sub: MsgTransport<any>['sub'] = ({ domain, handler, type }) => {
    const filterHandler = (_: IdentifiedDomainEvent<any, any>) => {
      if (_.domain !== domain || _.type !== type) {
        return
      }
      handler(_)
    }
    return subAll(filterHandler)
  }

  const api: MsgTransport<any>['api'] = ({ domain, apiName, arg }) =>
    new Promise((resolve, reject) => {
      const id = _id()
      const reqEvtType = `${domain}#${apiName}`
      const reqEvt: ApiEvt = { id, arg, req: true }
      emitter.emit(reqEvtType, reqEvt)

      const responseHandler = (evt: ApiEvt) => {
        if (evt.id !== id || evt.req) {
          return
        }
        unsub()
        resolve(evt.arg)
      }
      emitter.addListener(reqEvtType, responseHandler)
      const unsub = () => emitter.removeListener(reqEvtType, responseHandler)
      setTimeout(() => {
        unsub()
        reject('timeout')
      }, apiTimeout)
    })

  const transport: MsgTransport<any> & { emitter: EventEmitter } = {
    pub,
    sub,
    api,
    emitter,
  }

  return transport
}

export const bindApis = <D extends Domain>(
  domain: D['name'],
  apis: DomainApiMap<D>,
  emitter: EventEmitter
) => {
  Object.entries(apis).forEach(([apiName, fun]) => {
    const reqEvtType = `${domain}#${apiName}`
    emitter.addListener(reqEvtType, async (reqEvt: ApiEvt) => {
      if (!reqEvt.req) {
        return
      }
      const response = await fun(reqEvt.arg)
      emitter.emit(reqEvtType, { id: reqEvt.id, arg: response, req: false })
    })
  })
}

type ApiEvt = {
  req: boolean
  id: string
  arg: any
}
