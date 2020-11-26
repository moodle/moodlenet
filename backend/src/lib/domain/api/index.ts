import { Message } from 'amqplib'
import { newUuid } from '../../helpers/misc'
import * as AMQP from '../amqp'
import { Flow } from '../types/path'
import { getApiBindRoute } from '../bindings'
import * as Types from './types'

const DEF_TIMEOUT = 5000
const DEF_LAG_TIMEOUT = 300
const TIMEOUT_MSG = 'API CALL TIMEOUT'
const NO_REPLY_CALL_MSG = 'NO REPLY CALL'
const TIMEOUT_REPLY: Types.ReplyError = { ___ERROR: { msg: TIMEOUT_MSG } }
const NO_REPLY_CALL: Types.Reply<object> = { ___ERROR: { msg: NO_REPLY_CALL_MSG } }

export type CallOpts = {
  timeout?: number
  noReply?: boolean
  delay?: number
}

export type CallResponse<Res extends object> = { res: Types.Reply<Res>; flow: Flow }
export const call = <Domain>(domain: string) => <ApiPath extends Types.ApiLeaves<Domain>>(_: {
  api: ApiPath
  req: Types.ApiReq<Domain, ApiPath>
  flow?: Flow
  opts?: CallOpts
}) => {
  type ResType = Types.ApiRes<Domain, ApiPath>
  return new Promise<CallResponse<ResType>>((resolve, reject) => {
    const { api, flow: progress, req, opts } = _
    const uuid = progress ? '' : newUuid()
    const flow: Flow = progress || { _key: uuid, _route: uuid }
    const expiration = opts?.timeout || DEF_TIMEOUT
    const localTimeout = expiration + DEF_LAG_TIMEOUT
    const wantsReply = !opts?.noReply
    let unsubEmitter = () => {}
    if (wantsReply) {
      unsubEmitter =
        AMQP.mainNodeQEmitter.sub<ResType>({
          flow,
          handler({ jsonContent, unsub }) {
            unsub()
            resolve(response(jsonContent))
          },
        }) || unsubEmitter
    } else {
      resolve(errResponse(NO_REPLY_CALL))
    }
    AMQP.domainPublish({
      domain,
      flow,
      topic: api,
      payload: req,
      opts: {
        correlationId: flow._key,
        replyToNodeQ: wantsReply,
        expiration,
        delay: opts?.delay,
      },
    })
      .then((_) => {
        setTimeout(() => {
          resolve(errResponse(TIMEOUT_REPLY))
          unsubEmitter()
        }, localTimeout)
      })
      .catch((err) => {
        unsubEmitter()
        reject(err)
      })

    function response(res: ResType): CallResponse<ResType> {
      return { flow, res: { ...res, ___ERROR: null } }
    }
    function errResponse(err: Types.ReplyError): CallResponse<ResType> {
      return { flow, res: err }
    }
  })
}
export const getApiResponderQName = <Domain>(api: Types.ApiLeaves<Domain>) => `API_RESPONDER:${api}`
export const respond = <Domain>(domain: string) => async <
  ApiPath extends Types.ApiLeaves<Domain>
>(_: {
  api: ApiPath
  pFlow?: Partial<Flow>
  handler(_: {
    req: Types.ApiReq<Domain, ApiPath>
    flow: Flow
    disposeResponder(): unknown
    unbindThisRoute(): unknown
    detour(api: Types.ApiLeaves<Domain>): Flow
  }): Promise<Types.ApiRes<Domain, ApiPath>>
}) => {
  const { api, handler, pFlow = {} } = _
  const apiResponderQName = getApiResponderQName<Domain>(api)
  const topic = `${api}.${pFlow._route || '*'}.${pFlow._key || '*'}`
  await AMQP.assertQ({
    name: apiResponderQName,
    opts: { durable: true },
  })
  const { unbind } = await AMQP.bindQ({ topic, domain, name: apiResponderQName })

  const { stopConsume } = await AMQP.queueConsume({
    qName: apiResponderQName,
    async handler({ msg, msgJsonContent, flow }) {
      const detour = (api: Types.ApiLeaves<Domain>): Flow => ({
        ...flow,
        _route: getApiBindRoute(api),
      })
      return handler({
        req: msgJsonContent,
        flow,
        detour,
        disposeResponder,
        unbindThisRoute,
      })
        .then((resp) => {
          reply({ msg, flow, resp: { ___ERROR: null, ...resp } })
          return AMQP.Acks.ack
        })
        .catch((err) => {
          reply({ msg, flow, resp: { ___ERROR: { msg: String(err) } } })
          return AMQP.Acks.reject
        })
      function unbindThisRoute() {
        const thisTopic = msg.fields.routingKey
        AMQP.unbindQ({ domain, name: apiResponderQName, topic: thisTopic })
      }
    },
    opts: { consumerTag: apiResponderQName },
  })
  return disposeResponder
  function disposeResponder() {
    stopConsume()
    unbind()
  }
  function reply<T extends object>(_: { flow: Flow; msg: Message; resp: Types.Reply<T> }) {
    const { flow, msg, resp } = _
    const replyQ = msg.properties.replyTo
    if (replyQ) {
      console.table({ _: 'Replying', replyQ, ...flow })
      AMQP.sendToQueue({
        name: replyQ,
        content: resp,
        flow,
      })
    }
  }
}

export const isTimeoutReply = (_: Types.Reply<object>) => _.___ERROR?.msg === TIMEOUT_MSG
export const isNoReplyCall = (_: Types.Reply<object>) => _.___ERROR?.msg === NO_REPLY_CALL_MSG

// type s = Types.ApiRes<MoodleNetDomain, 'Accounting.Register_New_Account.Request'>
// type q = Types.ApiReq<MoodleNetDomain, 'Accounting.Register_New_Account.Request'>

// call<MoodleNetDomain>('')({
//   path: 'Accounting.Register_New_Account.Request',
//   req: { email: '', username: '' },
// }).then(({ id, res }) => {
//   if (!res.___ERROR) {
//     res.ciccio
//   } else {
//     res.___ERROR.msg
//   }
// })

// responder<MoodleNetDomain>('')({
//   api: 'Accounting.Register_New_Account.Request',
//   async handler({ req /* disposeResponder */ }) {
//     req.email
//     return { ciccio: 'pallo' } as const
//   },
// })
