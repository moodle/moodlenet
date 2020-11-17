// import { delay } from 'bluebird'
import { Message, Options, Replies } from 'amqplib'
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
const __LOG = false

type DomainQueueOpts = Options.AssertQueue & {}
type DomainConsumeOpts = Options.Consume & {
  rejectStrategy?: AckKO
}
type DomainPublishOpts = Options.Publish & {
  delay?: number
}
type DomainExOpts = Options.AssertExchange & {}
export type AckKO = 'nack' | 'reject'
export type Ack = 'ack' | AckKO

export const publish = async <Point extends Pointer<PathTo.AnyLeaf, any, any, any, any>>(_: {
  pointer: Point
  payload: Point['type']
  opts?: DomainPublishOpts
}) => {
  const { pointer, payload, opts } = _
  const topic = pathTopic(pointer.path)
  const domainName = pathDomainName(pointer.path)
  _log(`publish ${topic}`, payload)
  const ex = await getDomainExchangeName(domainName)
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
  return serviceConsume<Point>({
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

  return serviceConsume<Point>({
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

  return serviceConsume<Point>({
    pointer,
    handler: ({ payload, msg }) => {
      const info = wfStartMsgRoutingInfo(msg)
      return handler({ payload, info })
    },
    opts,
  })
}

const serviceConsume = async <Point extends Pointer<PathTo.AnyLeaf, any, any, any, any>>(_: {
  pointer: Point
  handler: (_: { payload: Point['payload']; msg: Message }) => Ack | Promise<Ack>
  opts?: { consume?: DomainConsumeOpts }
}) => {
  const { pointer, handler, opts } = _
  const { /* domainName,ex, */ qName, topic } = await bindPointer({ dest: pointer })
  _log(`consume ${topic}`)
  const rejectStrategy = opts?.consume?.rejectStrategy || 'reject'

  const ch = await channel
  const cons = await ch.consume(
    qName,
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
      // consumerTag: `${topic}|${newUuid()}`,
      ...opts?.consume,
    }
  )
  return () => {
    ch.cancel(cons.consumerTag)
    ch.deleteQueue(qName)
  }
}

const pathTopic = (p: PathTo.AnyLeaf) => {
  return p.join('.')
}
const pathDomainName = (p: PathTo.AnyLeaf) => {
  return p[0]
}

const bindPointer = async <
  Dest extends Pointer<any, any, any, any, any>,
  Src extends Dest extends Pointer<any, infer Type, any, any, any>
    ? Pointer<any, Type, any, any, any>
    : never
>(_: {
  dest: Dest
  src?: Src
  args?: any
  opts?: DomainQueueOpts
}) => {
  const { dest, src, args, opts } = _
  const qName = pathTopic(dest.path)
  const topic = src ? pathTopic(src.path) : qName
  const domainName = pathDomainName((src || dest).path)
  const ex = await getDomainExchangeName(domainName)
  await assertQ({ name: qName, opts })
  await bindQ({
    name: qName,
    ex,
    topic,
    args,
  })
  return {
    qName,
    topic,
    ex,
    domainName,
  }
}

const bindQ = async (_: { name: string; ex: string; topic: string; args?: any }) => {
  const { args, ex, name, topic } = _
  if (!asserts.BQ[name]) {
    const ch = await channel
    await ch.bindQueue(name, ex, topic, args)
    delete asserts.BQ[`${name}${ex}${topic}`]
  }
  return asserts.BQ[name]
}

const unbindQ = async (_: { name: string; ex: string; topic: string; args?: any }) => {
  const { args, ex, name, topic } = _
  if (!asserts.BQ[name]) {
    const ch = await channel
    await ch.unbindQueue(name, ex, topic, args)
    delete asserts.BQ[`${name}${ex}${topic}`]
  }
  return asserts.BQ[name]
}

// TODO: may remove BQ?
const asserts = { Q: {}, X: {}, BQ: {} } as {
  Q: Record<string, Replies.AssertQueue>
  X: Record<string, Replies.AssertExchange>
  BQ: Record<string, boolean>
}
const assertQ = async (_: { name: string; opts?: DomainQueueOpts }) => {
  const { opts, name } = _
  if (!asserts.Q[name]) {
    const ch = await channel
    asserts.Q[name] = await ch.assertQueue(name, {
      ...opts,
    })
  }
  return asserts.Q[name]
}
const assertX = async (_: {
  name: string
  type: '' | 'topic' | 'direct' | 'headers' | 'fanout' | 'match'
  opts?: DomainExOpts
}) => {
  const { opts, name, type } = _
  if (!asserts.X[name]) {
    const ch = await channel
    asserts.X[name] = await ch.assertExchange(name, type, opts)
  }
  return asserts.X[name]
}

const getDomainExchangeName = async (domainName: string) => {
  const exName = `Domain.${domainName}`
  return (await assertX({ name: exName, type: 'topic' })).exchange
}
const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))

const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

const _log = (...args: any[]) =>
  __LOG &&
  console.log('DOM----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')
