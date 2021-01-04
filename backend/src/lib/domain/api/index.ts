import { Message } from 'amqplib'
import { graphql, GraphQLSchema } from 'graphql'
import * as AMQP from '../amqp'
import { nodeId } from '../helpers'
import { Flow } from '../types/path'
import * as Types from './types'

const DEF_TIMEOUT_EXPIRATION = 5000
const DEF_LAG_TIMEOUT = 300
const REPLY_TIMEOUT_RESPONSE_MSG = 'REPLY TIMEOUT'
const JUST_ENQUEUED_RESPONSE_MSG = 'JUST ENQUEUED'
const REPLY_TIMEOUT_RESPONSE: Types.ReplyError = {
  ___ERROR: { msg: REPLY_TIMEOUT_RESPONSE_MSG },
}
const JUST_ENQUEUED_RESPONSE: Types.Reply<object> = {
  ___ERROR: { msg: JUST_ENQUEUED_RESPONSE_MSG },
}

export type CallOpts =
  | {
      justEnqueue: true // FIXME: remove this and make a specific method "enqueueApi"
      delaySecs?: number // that doesn't return the actual Api Reply<Response>
    }
  | {
      justEnqueue?: false | undefined
      timeout?: number
    }

export type CallResponse<Res extends object> = {
  res: Types.Reply<Res>
  flow: Flow
}
export type ApiCallArgs<Domain, ApiPath extends Types.ApiLeaves<Domain>> = {
  api: ApiPath
  req: Types.ApiReq<Domain, ApiPath>
  flow: Flow
  opts?: CallOpts
}
export const call = <Domain>(domain: string) => <
  ApiPath extends Types.ApiLeaves<Domain>
>(
  _: ApiCallArgs<Domain, ApiPath>
) => {
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
      const delay =
        opts?.justEnqueue && opts?.delaySecs ? opts.delaySecs * 1000 : undefined
      const expiration = opts?.justEnqueue
        ? delay || undefined
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
      log(flow, `\n\nAPI call : ${api}`)

      AMQP.domainPublish({
        domain,
        flow,
        topic: api,
        payload: req,
        opts: {
          correlationId: flow._key,
          replyToNodeQ: !opts?.justEnqueue,
          expiration,
          delay,
        },
      })
        .then((_) => {
          if (!opts?.justEnqueue) {
            const localTimeout =
              expiration === undefined ? 0 : expiration + DEF_LAG_TIMEOUT

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
export type ApiResponderOpts = {
  partialFlow?: Partial<Flow>
  consume?: AMQP.DomainConsumeOpts
  queue?: AMQP.DomainQueueOpts
  // TODO: ApiResponderOpts should have channelOpts too
}

export type RespondApiArgs<Domain, ApiPath extends Types.ApiLeaves<Domain>> = {
  api: ApiPath
  handler(_: {
    req: Types.ApiReq<Domain, ApiPath>
    flow: Flow
    disposeResponder(): unknown
    unbindThisRoute(): unknown
  }): Promise<Types.ApiRes<Domain, ApiPath>>
  opts?: ApiResponderOpts
}

export const assertApiResponderQueue = async <Domain>(_: {
  api: Types.ApiLeaves<Domain>
  qOpts?: AMQP.DomainQueueOpts
}) => {
  const { api, qOpts } = _
  const apiResponderQName = getApiResponderQName<Domain>(api)
  await AMQP.assertQ({
    name: apiResponderQName,
    opts: { ...qOpts, durable: true },
  })
  return {
    apiResponderQName,
  }
}
export const getApiResponderQName = <Domain>(api: Types.ApiLeaves<Domain>) =>
  `API_RESPONDER:${api}`
// TODO: each responder (or each queue consumer in general ?) should use its own channel
// TODO: ApiResponderOpts should have channelOpts too

export const respond = <Domain>(domain: string) => async <
  ApiPath extends Types.ApiLeaves<Domain>
>(
  _: RespondApiArgs<Domain, ApiPath>
) => {
  const { api, handler, opts } = _
  const topic = `${api}.${opts?.partialFlow?._route || '*'}.${
    opts?.partialFlow?._key || '*'
  }`
  const { apiResponderQName } = await assertApiResponderQueue<Domain>({
    api,
    qOpts: opts?.queue,
  })
  const exchange = AMQP.getDomainExchangeName(domain)
  const { unbind } = await AMQP.bindQ({
    topic,
    exchange,
    name: apiResponderQName,
  })

  const { stopConsume } = await AMQP.queueConsume({
    qName: apiResponderQName,
    async handler({ msg, msgJsonContent, flow }) {
      log(flow, `\n\nAPI consume : ${api}`)
      return handler({
        req: msgJsonContent,
        flow,
        disposeResponder,
        unbindThisRoute,
      })
        .then((resp) => {
          reply({ msg, flow, resp: { ___ERROR: null, ...resp } })
          return AMQP.Acks.ack
        })
        .catch((err) => {
          log(flow, `API error`, err)
          reply({ msg, flow, resp: { ___ERROR: { msg: String(err) } } })
          return AMQP.Acks.reject
        })
      function unbindThisRoute() {
        const thisTopic = msg.fields.routingKey
        AMQP.unbindQ({ exchange, name: apiResponderQName, topic: thisTopic })
      }
    },
    opts: { consumerTag: `${apiResponderQName}@${nodeId}`, ...opts?.consume },
  })
  return disposeResponder
  function disposeResponder() {
    stopConsume()
    unbind()
  }
  function reply<T extends object>(_: {
    flow: Flow
    msg: Message
    resp: Types.Reply<T>
  }) {
    const { flow, msg, resp } = _
    const replyQ = msg.properties.replyTo
    log(flow, `\n\nAPI reply : ${api}`)
    if (replyQ) {
      //TODO: better publish it to exchange ? is it possible ?
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

const log = (flow: Flow, ...args: any[]) =>
  console.log(
    '\n\n\n',
    args.map((_) => `\\n${_}`),
    `\\nflow : ${flow._key} - ${flow._route}`
  )

export const getGQLApiResponder = ({
  schema,
}: {
  schema: GraphQLSchema
}) => async ({ req }: any) => {
  const { query, root, context, variables } = req
  const resp = await graphql(schema, query, root, context, variables)
  return {
    data: resp.data,
    errors: resp.errors,
    extensions: resp.extensions,
  }
}
