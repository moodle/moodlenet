import { Message } from 'amqplib'
import * as AMQP from '../amqp'
import { Flow } from '../types/path'
import { getApiBindRoute } from '../bindings'
import * as Types from './types'

const DEF_TIMEOUT_EXPIRATION = 5000
const DEF_LAG_TIMEOUT = 300
const REPLY_TIMEOUT_RESPONSE_MSG = 'REPLY TIMEOUT'
const JUST_ENQUEUED_RESPONSE_MSG = 'JUST ENQUEUED'
const REPLY_TIMEOUT_RESPONSE: Types.ReplyError = { ___ERROR: { msg: REPLY_TIMEOUT_RESPONSE_MSG } }
const JUST_ENQUEUED_RESPONSE: Types.Reply<object> = {
  ___ERROR: { msg: JUST_ENQUEUED_RESPONSE_MSG },
}

export type CallOpts =
  | {
      justEnqueue: true
      delay?: number
    }
  | {
      justEnqueue?: false | undefined
      timeout?: number
    }

export type CallResponse<Res extends object> = { res: Types.Reply<Res>; flow: Flow }
export const call = <Domain>(domain: string) => <ApiPath extends Types.ApiLeaves<Domain>>(_: {
  api: ApiPath
  req: Types.ApiReq<Domain, ApiPath>
  flow: Flow
  opts?: CallOpts
}) => {
  type ResType = Types.ApiRes<Domain, ApiPath>
  return new Promise<CallResponse<ResType>>(
    (
      resolve: (arg0: {
        res: Types.Reply<Types.ApiRes<Domain, ApiPath>>
        flow: Flow<string, string>
      }) => void,
      reject: (arg0: any) => void
    ) => {
      const { api, flow, req, opts } = _

      const expiration = opts?.justEnqueue
        ? opts?.delay || undefined
        : opts?.timeout || DEF_TIMEOUT_EXPIRATION

      let unsubEmitter = () => {}
      if (opts?.justEnqueue) {
        resolve(errResponse(JUST_ENQUEUED_RESPONSE))
      } else {
        unsubEmitter = AMQP.mainNodeQEmitter.sub<ResType>({
          flow,
          handler({ jsonContent, unsub }) {
            unsub()
            resolve(response(jsonContent))
          },
        })
      }

      AMQP.domainPublish({
        domain,
        flow,
        topic: api,
        payload: req,
        opts: {
          correlationId: flow._key,
          replyToNodeQ: !opts?.justEnqueue,
          expiration,
          delay: opts?.justEnqueue ? opts?.delay : undefined,
        },
      })
        .then((_) => {
          if (!opts?.justEnqueue) {
            const localTimeout = expiration === undefined ? 0 : expiration + DEF_LAG_TIMEOUT

            setTimeout(() => {
              resolve(errResponse(REPLY_TIMEOUT_RESPONSE))
              unsubEmitter()
            }, localTimeout)
          }
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
    }
  )
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
      //TODO: better publishit to exchange ? is it possible ?
      AMQP.sendToQueue({
        name: replyQ,
        content: resp,
        flow,
      })
    }
  }
}

export const isTimeoutReply = (_: Types.Reply<object>) =>
  _.___ERROR?.msg === REPLY_TIMEOUT_RESPONSE_MSG
export const isNoReplyCall = (_: Types.Reply<object>) =>
  _.___ERROR?.msg === JUST_ENQUEUED_RESPONSE_MSG

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
