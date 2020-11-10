import { newUuid } from '../helpers/misc'
import { channelPromise } from './domain.env'
import {
  Domain,
  DomainName,
  EventNames,
  EventPayload,
  ServiceNames,
  WFAction,
  WFConsumer,
  Workflow,
  WorkflowActionPayload,
  WorkflowNames,
  WorkflowStartParams,
} from './types'
const json2Buffer = (json: any) => Buffer.from(JSON.stringify(json))

const buffer2Json = (buf: Buffer) => JSON.parse(buf.toString('utf-8'))

export const make = <D extends Domain>(domainName: DomainName<D>) => {
  const ExchangeName = `Domain.${domainName}`
  const channel = channelPromise.then((ch) => (ch.assertExchange(ExchangeName, 'topic'), ch))

  const enqueue = async <S extends ServiceNames<D>, WF extends WorkflowNames<D, S>>(
    srv: S,
    wf: WF,
    params: WorkflowStartParams<D, S, WF>
  ) => {
    const uuid = newUuid()
    const done = await (await channel).publish(
      ExchangeName,
      makeWfTopic(srv, wf, uuid, 'enqueue'),
      json2Buffer(params)
    )
    if (!done) {
      throw new Error(`couldn't enqueue`)
    }
    return joinWfId({ srv, wf, uuid })
  }

  const bindWF = <
    S extends ServiceNames<D>,
    W extends WorkflowNames<D, S>,
    A extends Exclude<WFAction, 'enqueue'>,
    T extends keyof Workflow<D, S, W>[A]
  >(
    srv: S, // | TopicWildCard = '*',
    wf: W, // | TopicWildCard = '*',
    uuid: string = '*',
    action: A, // | TopicWildCard = '*',
    type: T, // | TopicWildCard = '*',
    handler: (payload: WorkflowActionPayload<D, S, W, A, T>) => unknown
  ) => makeWfTopic(srv, wf, uuid, action)

  const bindEV = <S extends ServiceNames<D>, EV extends EventNames<D, S>>(
    srv: S, // | TopicWildCard = '*',
    ev: EV, // | TopicWildCard = '*'
    handler: (payload: EventPayload<D, S, EV>) => unknown
  ) => makeEvTopic(srv, ev)

  const assertConsumeWFQ = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W
  ) => {
    const ch = await channel

    const aq = await ch.assertQueue(`${domainName}.${srv}.${wf}`, {
      durable: true,
    })
    const topic = makeWfTopic(srv, wf, '*', 'enqueue')
    ch.bindQueue(aq.queue, ExchangeName, topic)

    return aq
  }

  const consumeWF = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    consumer: WFConsumer<D, S, W>
  ) => {
    const ch = await channel
    const aq = await assertConsumeWFQ(srv, wf)

    const cons = await ch.consume(aq.queue, (msg) => {
      if (!msg) {
        return
      }
      const wfIdsplit = splitWfId(msg.fields.routingKey)
      const wfid = (wfIdsplit && joinWfId(wfIdsplit)) || 'N/A'
      // TODO: aggiungere gli argomenti progress end
      // TODO: lo stato deve andare a "started" .. non so ancora come
      consumer(buffer2Json(msg.content), { wfid })
    })
    return cons.consumerTag
  }

  return {
    enqueue,
    bindWF,
    bindEV,
    consumeWF,
    assertConsumeWFQ,
  }
}

const makeWfTopic = (
  srv: string,
  wf: string,
  uuid: string,
  action: WFAction, //| TopicWildCard | 'start'
  type?: WFAction extends 'enqueue' ? never : string
) => `${joinWfId({ srv, wf, uuid })}.${action}${!type || action === 'enqueue' ? '' : `.${type}`}`

const makeEvTopic = (srv: string, ev: string) => `${srv}.ev.${ev}`
const joinWfId = (_: { srv: string; wf: string; uuid: string }) =>
  hasWildcards([_.srv, _.wf, _.uuid]) ? null : `${_.srv}.wf.${_.wf}.${_.uuid}`
const splitWfId = (wfId: string) => {
  const arr = wfId.split('.')
  return arr.length >= 4 && arr[1] === 'wf' && hasWildcards(arr)
    ? null
    : { srv: arr[0], wf: arr[2], uuid: arr[3] }
}

const hasWildcards = (arr: string[]) => arr.filter((_) => _ === '*' || _ === '#').length > 0
