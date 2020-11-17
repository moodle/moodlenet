// import { delay } from 'bluebird'
import { Message, Options } from 'amqplib'
import { newUuid } from '../helpers/misc'
import {
  eventMsgRoutingInfo,
  EventMsgRoutingInfo,
  wfLifeMsgRoutingInfo,
  WfLifeMsgRoutingInfo,
  wfStartMsgRoutingInfo,
  WfStartMsgRoutingInfo,
  wfStartPointerInfo,
} from './domain'
import { channelPromise as channel, persistence } from './domain.env'
import { NoWildPointer, PathTo, Pointer } from './types'

const assertedExchanges = {} as any
const getDomainExchangeName = async (domainName: string) => {
  const exName = `Domain.${domainName}`
  if (!assertedExchanges[exName]) {
    ;(await channel).assertExchange(exName, 'topic')
  }
  return exName
}

export type DomainQueueOpts = Options.AssertQueue & {}
export type DomainConsumeOpts = Options.Consume & {
  static?: string
  rejectStrategy?: AckKO
}
export type DomainPublishOpts = Options.Publish & {
  delay?: number
}
export type AckKO = 'nack' | 'reject'
export type Ack = 'ack' | AckKO

export const publish = async <Point extends Pointer<PathTo.AnyLeaf, any, any, any, any>>(_: {
  pointer: Point
  payload: Point['type']
  opts?: DomainPublishOpts
}) => {
  const { pointer, payload, opts } = _
  const topicArr = pointer.path
  const topic = topicArr.join('.')
  _log(`publish ${topic}`, payload)
  const ex = await getDomainExchangeName(topicArr[0])
  const pub = await (await channel).publish(ex, topic, json2Buffer(payload), opts)
  return pub
}

export const publishEv = async <Point extends Pointer<PathTo.Event, any, any, any, any>>(_: {
  pointer: NoWildPointer<Point>
  payload: Point['type']
  opts?: DomainPublishOpts
}) => {
  const { pointer, payload, opts } = _
  return publish({ pointer, payload, opts })
}

export const publishWf = async <Point extends Pointer<PathTo.WF, any, any, any, any>>(_: {
  pointer: NoWildPointer<Point>
  id: string
  payload: Point['type']
  opts?: DomainPublishOpts
}) => {
  const { pointer: _pointer, id, payload, opts } = _
  const pointer = ({ path: [..._pointer.path, id] } as any) as Point
  return publish<Point>({ pointer, payload, opts })
}

export const publishWfStart = async <Point extends Pointer<PathTo.WFStart, any, any, any, any>>(_: {
  pointer: NoWildPointer<Point>
  payload: Point['type']
  opts?: DomainPublishOpts
}) => {
  const { pointer, payload, opts } = _
  const id = newUuid()
  const { domain, service: srv, wfname: wf } = wfStartPointerInfo(pointer)
  persistence.enqueueWF({ id, startParams: payload, domain, srv, wf })
  return (await publishWf({ pointer, id, payload, opts })) && id
}

export const consumeEv = async <Point extends Pointer<PathTo.Event, any, any, any, any>>(_: {
  pointer: Point
  handler: (_: { payload: Point['payload']; info: EventMsgRoutingInfo }) => Ack | Promise<Ack>
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
}) => {
  const { pointer, handler, opts } = _
  return consume<Point>({
    pointer,
    handler: ({ payload, msg }) => {
      const info = eventMsgRoutingInfo(msg)
      return handler({ payload, info })
    },
    opts,
  })
}
export const consumeWf = async <Point extends Pointer<PathTo.WFLife, any, any, any, any>>(_: {
  pointer: Point
  id: string
  handler: (_: { payload: Point['payload']; info: WfLifeMsgRoutingInfo }) => Ack | Promise<Ack>
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
}) => {
  const { pointer: _pointer, id, handler, opts } = _
  const pointer = { path: [..._pointer.path, id] } as any

  return consume<Point>({
    pointer,
    handler: ({ payload, msg }) => {
      const info = wfLifeMsgRoutingInfo(msg)
      return handler({ payload, info })
    },
    opts,
  })
}
export const consumeWfStart = async <Point extends Pointer<PathTo.WFStart, any, any, any, any>>(_: {
  pointer: Point
  id: string
  handler: (_: { payload: Point['payload']; info: WfStartMsgRoutingInfo }) => Ack | Promise<Ack>
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
}) => {
  const { pointer: _pointer, id, handler, opts } = _
  const pointer = { path: [..._pointer.path, id] } as any

  return consume<Point>({
    pointer,
    handler: ({ payload, msg }) => {
      const info = wfStartMsgRoutingInfo(msg)
      return handler({ payload, info })
    },
    opts,
  })
}

export const consume = async <Point extends Pointer<PathTo.AnyLeaf, any, any, any, any>>(_: {
  pointer: Point
  // TODO:
  // FIXME: handler: (_: Point['type'], msg: amqpMessage)
  handler: (_: { payload: Point['payload']; msg: Message }) => Ack | Promise<Ack>
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
}) => {
  const { pointer, handler, opts } = _
  const topicArr = pointer.path
  const topic = topicArr.join('.')
  const domainName = topicArr[0]
  _log(`consume ${topic}`)
  const ch = await channel
  const ex = await getDomainExchangeName(domainName)
  const qname = opts?.consume?.static || newUuid()
  const rejectStrategy = opts?.consume?.rejectStrategy || 'reject'
  await ch.assertQueue(qname, {
    ...opts?.queue,
    exclusive: true,
  })
  await ch.bindQueue(qname, ex, topic)

  const cons = await ch.consume(
    qname,
    async (msg) => {
      if (!msg) {
        return
      }
      try {
        _log(`got msg `, msg.fields)
        const routingKeyArr = msg.fields.routingKey.split('.')
        const payloadTypeRevIndex =
          routingKeyArr[3] === 'ev' ? 1 : routingKeyArr[3] === 'wf' ? 2 : 0

        const payloadType = routingKeyArr[routingKeyArr.length - payloadTypeRevIndex]
        const jsonContent = buffer2Json(msg.content)
        const payload = { p: jsonContent, t: payloadType }
        const ack = await handler({ payload, msg })
        ch[ack](msg)
      } catch (err) {
        ch[rejectStrategy](msg)
      }
    },
    {
      exclusive: true,
    }
  )
  return () => {
    ch.cancel(cons.consumerTag)
    ch.deleteQueue(qname)
  }
}

const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))

const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

const _log = (...args: any[]) =>
  console.log('DOM----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')
