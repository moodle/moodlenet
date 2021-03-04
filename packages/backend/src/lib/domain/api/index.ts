import { Executor } from '@graphql-tools/delegate/types'
import { Message } from 'amqplib'
import { graphql /* , GraphQLError */, GraphQLSchema, print } from 'graphql'
import * as AMQP from '../amqp'
import { api } from '../domain'
import { flowId, flowIdElse, flowRouteElse, nodeId } from '../helpers'
import { Flow /* , TypeofPath */, PFlow } from '../types/path'
import * as Types from './types'

const DEF_TIMEOUT_EXPIRATION = 5000
const DEF_LAG_TIMEOUT = 300

const REPLY_TIMEOUT_RESPONSE_MSG = 'REPLY_TIMEOUT_RESPONSE_MSG'
const REPLY_TIMEOUT_RESPONSE = Types.apiReplyError(REPLY_TIMEOUT_RESPONSE_MSG)
export const isReplyTimeout = (_: any) => Types.isReplyError(_) && _.___API_REPLY_ERROR === REPLY_TIMEOUT_RESPONSE_MSG

export type CallOpts =
  | {
      justEnqueue: true // FIXME: remove this and implement an explicit method "enqueueApi"
      delaySecs?: number // that doesn't return the actual Api Reply<Response>
    }
  | {
      justEnqueue?: false | undefined
      timeout?: number
    }

export type CallResponse<Res> = Res

export type ApiCallArgs<Domain, ApiPath extends Types.ApiLeaves<Domain>> = {
  api: ApiPath
  // req: Types.ApiReq<Domain, ApiPath>
  flow: Flow
  opts?: CallOpts
}
let callCount = 0

export const call = <Domain>(domain: string) => <ApiPath extends Types.ApiLeaves<Domain>>(
  _: ApiCallArgs<Domain, ApiPath>,
) => {
  type ResType = Types.ApiRes<Domain, ApiPath> extends Promise<infer T> ? T : never
  // return (req: Types.ApiReq<Domain, ApiPath>): Promise<ResType> => {
  return ((req: any) => {
    return new Promise(
      /* <CallResponse<ResType>> */ (resolveCall: (arg0: ResType) => void, rejectCall: (arg0: any) => void) => {
        const { api, flow, /* req, */ opts } = _
        const delay = opts?.justEnqueue && opts?.delaySecs ? opts.delaySecs * 1000 : undefined
        const expiration = opts?.justEnqueue ? delay || undefined : opts?.timeout || DEF_TIMEOUT_EXPIRATION
        const messageId = `${nodeId}.${Number(new Date())}.${callCount++}`

        let unsubFromReplyEmitter = () => {}
        if (!opts?.justEnqueue) {
          unsubFromReplyEmitter = AMQP.mainNodeQEmitter.sub<ResType>({
            messageId,
            handler({ jsonContent, unsub }) {
              unsub()
              const response = getResponse(jsonContent)
              if (Types.isReplyError(response)) {
                log(`reply Error`, response)
                rejectCall(response)
              } else {
                log(`reply  response`, response)
                resolveCall(response)
              }
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
            messageId,
            correlationId: flowId(flow),
            replyToNodeQ: !opts?.justEnqueue,
            expiration,
            delay,
          },
        })
          .then(() => {
            if (!opts?.justEnqueue) {
              const localTimeout = expiration === undefined ? 0 : expiration + DEF_LAG_TIMEOUT

              setTimeout(() => {
                rejectCall(REPLY_TIMEOUT_RESPONSE)
                unsubFromReplyEmitter()
              }, localTimeout)
            } else {
              resolveCall({} as any)
            }
          })
          .catch(err => {
            unsubFromReplyEmitter()
            Types.apiCallError(err)
          })

        function getResponse(res: ResType): CallResponse<ResType> {
          return res
        }
      },
    )
  }) as Types.ApiDef<Domain, ApiPath> //as _OmitThisParameterForCall<Types.ApiDef<Domain, ApiPath>>
}
export type ApiResponderOpts = {
  pFlow?: PFlow
  consume?: AMQP.DomainConsumeOpts
  queue?: AMQP.DomainQueueOpts
  // TODO: ApiResponderOpts should have channelOpts too
}

export type RespondApiHandler<A> = A extends Types.Api<infer Req, infer Res>
  ? (_: { req: Req; flow: Flow; disposeResponder(): unknown; unbindThisRoute(): unknown }) => Promise<Res>
  : never

export type RespondApiArgs<Domain, ApiPath extends Types.ApiLeaves<Domain>> = {
  api: ApiPath
  // handler(
  //   req: Types.ApiReq<Domain, ApiPath>,
  //   apiBag: Types.ApiBag
  // ): Types.ApiRes<Domain, ApiPath>
  handler: OmitThisParameter<Types.ApiDef<Domain, ApiPath>>
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
export const getApiResponderQName = <Domain>(api: Types.ApiLeaves<Domain>) => `API_RESPONDER:${api}`
// TODO: each responder (or each queue consumer in general ?) should use its own channel
// TODO: ApiResponderOpts should have channelOpts too
const defaultConsumeOpts: AMQP.DomainConsumeOpts = {}
export const respond = <Domain>(domain: string) => async <ApiPath extends Types.ApiLeaves<Domain>>(
  _: RespondApiArgs<Domain, ApiPath>,
) => {
  const { api, handler, opts } = _
  const [route, id] = [flowRouteElse(opts?.pFlow, '*'), flowIdElse(opts?.pFlow, '*')]
  const topic = `${api}.${route}.${id}`
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
      return Promise.resolve(handler(msgJsonContent))
        .then(resp => {
          reply({ msg, flow, resp })
          return AMQP.Acks.Done
        })
        .catch(exc => {
          log(flow, `API error`, exc)
          if (reply({ msg, flow, resp: Types.apiReplyError(exc) })) {
            return AMQP.Acks.Reject
          } else {
            return AMQP.Acks.Requeue
          }
        })
      // function unbindThisRoute() {
      //   const thisTopic = msg.fields.routingKey
      //   AMQP.unbindQ({ exchange, name: apiResponderQName, topic: thisTopic })
      // }
    },
    opts: { consumerTag: `${apiResponderQName}@${nodeId}`, ...defaultConsumeOpts, ...opts?.consume },
  })
  return disposeResponder

  function disposeResponder() {
    stopConsume()
    unbind()
  }

  function reply<T>(_: { flow: Flow; msg: Message; resp: Types.ApiReply<T> }) {
    const { flow, msg, resp } = _
    const replyQ = msg.properties.replyTo
    log(flow, `\n\nAPI reply : ${api}`)
    log(resp)
    if (replyQ) {
      //TODO: better publish it to exchange ? is it possible ?
      AMQP.sendToQueue({
        name: replyQ,
        content: resp,
        flow,
        opts: {
          correlationId: msg.properties.messageId,
        },
      })
      return true
    } else {
      return false
    }
  }
}

export const getGQLApiCallerExecutor = <DomainDef extends object>({
  getExecutionGlobalValues,
  api: apiPath,
  flow,
}: {
  getExecutionGlobalValues(..._: Parameters<Executor>): { context: any; root: any }
  api: Types.ApiLeaves<DomainDef>
  flow: Flow
}): Executor => async _ => {
  const { context, root } = getExecutionGlobalValues(_)
  const { document, variables /*,context, extensions, info */ } = _
  const query = print(document)
  log(`GQLApiCallerExecutor : ${apiPath}`, query, variables)

  const res = await api<DomainDef>(flow)<Types.ApiLeaves<DomainDef>>(apiPath).call((gqlCall: any) =>
    gqlCall({
      context,
      root,
      query,
      variables,
    }),
  )
  log({ res })
  return res
}

function log(...args: any[]) {
  console.log('\n\n\n', ...args.map(_ => (_ instanceof Error ? _.stack : _)))
}

export async function startGQLApiResponder<DomainDef>({
  schema,
  api: apiPath,
}: {
  schema: GraphQLSchema | Promise<GraphQLSchema>
  api: Types.ApiLeaves<DomainDef>
}) {
  return api<any>()<any>(apiPath).respond(async (req: any) => {
    const { query, root, context, variables } = req
    const resp = await graphql(await schema, query, root, context, variables)
    return {
      data: resp.data,
      errors: resp.errors,
      extensions: resp.extensions,
    }
  })
}
