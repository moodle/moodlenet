import { Domain, DomainApiMap } from '@mn-be/domain/DomainTypes'
import { EventEmitter } from 'events'
import { IdentifiedDomainEvent, MsgTransport, EventId } from '../DomainTransportTypes'

const DEF_API_TO = 5000
const DEF_EVT_NAME = '*'

const _id = () => Math.random().toString(36).substring(2)

type Opts = { logger?(_: IdentifiedDomainEvent<any, any>): unknown }
type Cfg = { apiTimeout?: number }

export const make = ({ apiTimeout = DEF_API_TO }: Cfg, { logger = () => {} }: Opts) => {
  const emitter = new EventEmitter()
  const apiReqEvtName = (_: { domain: Domain['name']; apiName: keyof any }) =>
    `${_.domain}#${String(_.apiName)}`
  const apiResEvtName = (_: { domain: Domain['name']; id: EventId; apiName: keyof any }) =>
    `${_.domain}#${String(_.apiName)}#${_.id}`

  const subAll = (handler: (event: IdentifiedDomainEvent<any, any>) => unknown) => {
    emitter.addListener(DEF_EVT_NAME, handler)
    return () => emitter.removeListener(DEF_EVT_NAME, handler)
  }

  const pub: MsgTransport<Domain>['pub'] = (event) => {
    const id = _id()

    const idEvent: IdentifiedDomainEvent<any, any> = {
      ...event,
      id,
    }
    emitter.emit(DEF_EVT_NAME, idEvent)
    logger(idEvent)
    return idEvent
  }

  const sub: MsgTransport<Domain>['sub'] = ({ domain, type, handler }) => {
    const filterHandler = (_: IdentifiedDomainEvent<any, any>) => {
      if (_.domain !== domain || _.type !== type) {
        return
      }
      handler(_)
    }
    return subAll(filterHandler)
  }

  const api: MsgTransport<Domain>['api'] = ({ domain, apiName, req }) =>
    new Promise((resolve, reject) => {
      const id = apiReq({ domain, apiName, req })
      const unsub = subApiRes({ apiName, domain, id, handler: resolve })
      setTimeout(() => {
        unsub()
        reject('timeout')
      }, apiTimeout)
    })
  const subApiReq: MsgTransport<Domain>['subApiReq'] = ({ domain, apiName, handler }) => {
    const reqEvtName = apiReqEvtName({ domain, apiName })

    const requestHandler = (evt: ApiEvt) => {
      if (!evt.isReq) {
        return
      }
      handler(evt.arg, evt.id)
    }
    emitter.addListener(reqEvtName, requestHandler)
    const unsub = () => emitter.removeListener(reqEvtName, requestHandler)
    return unsub
  }
  const apiReq: MsgTransport<Domain>['apiReq'] = ({ domain, apiName, req }) => {
    const id = _id()
    const reqEvtName = apiReqEvtName({ domain, apiName })
    const reqEvt: ApiEvt = { id, arg: req, isReq: true }
    emitter.emit(reqEvtName, reqEvt)
    return id
  }
  const apiRes: MsgTransport<Domain>['apiRes'] = ({ domain, apiName, id, res }) => {
    const resEvtName = apiResEvtName({ domain, id, apiName })

    const reqEvt: ApiEvt = { id, arg: res, isReq: false }
    emitter.emit(resEvtName, reqEvt)
  }
  const subApiRes: MsgTransport<Domain>['subApiRes'] = ({ domain, apiName, id, handler }) => {
    const resEvtName = apiResEvtName({ domain, id, apiName })

    const responseHandler = (evt: ApiEvt) => {
      if (evt.isReq || evt.id !== id) {
        return
      }
      handler(evt.arg, id)
    }
    emitter.addListener(resEvtName, responseHandler)
    const unsub = () => emitter.removeListener(resEvtName, responseHandler)
    return unsub
  }

  const transport: MsgTransport<any> /* & { emitter: EventEmitter } */ = {
    pub,
    sub,
    api,
    apiReq,
    apiRes,
    subApiReq,
    subApiRes,
    // emitter,
  }

  return transport
}

export const bindApis = <D extends Domain>(
  domain: D['name'],
  apis: DomainApiMap<D>,
  msgT: MsgTransport<D>
) =>
  Object.entries(apis).forEach(([apiName, fun]) => {
    msgT.subApiReq({
      domain,
      apiName,
      handler: async (arg, id) => {
        const res = await fun(arg)
        msgT.apiRes({ apiName, res, domain, id })
      },
    })
  })

type ApiEvt = {
  isReq: boolean
  id: string
  arg: any
}
