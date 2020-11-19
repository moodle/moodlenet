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
import { NoWildPointer, PathTo, Pointer, TypeUnion } from './types'
const __LOG = false

type DomainQueueOpts = Options.AssertQueue & {
  name?: string
}
type DomainConsumeOpts = Options.Consume & {
  rejectStrategy?: AckKO
}
type DomainPublishOpts = Options.Publish & {
  delay?: number
}
type DomainWfStartOpts = DomainPublishOpts & {
  parentWf?: string
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

  const routingKeyArr = pointer.path
  const payloadTypeRevIndex = routingKeyArr[3] === 'ev' ? 1 : routingKeyArr[3] === 'wf' ? 2 : 0
  const payloadType = routingKeyArr[routingKeyArr.length - payloadTypeRevIndex]
  const payloadBuf = json2Buffer({ p: payload, t: payloadType })
  const pub = await (await channel).publish(ex, topic, payloadBuf, opts)
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
  if (_pointer.path[5] === 'end') {
    persistence.endWF({ id, endProgress: payload })
  } else if (_pointer.path[5] === 'progress') {
    persistence.progressWF({ id, progress: payload })
  }
  const pointer = ({ path: [..._pointer.path, id] } as any) as Point
  return publish<Point>({ pointer, payload, opts })
}

export const publishWfStart = async <Point extends Pointer<PathTo.WFStart, any, any, any, any>>(_: {
  pointer: NoWildPointer<Point>
  payload: Point['type']
  opts?: DomainWfStartOpts
}) => {
  const { pointer, payload, opts } = _
  const id = newUuid()
  const { domain, service: srv, wfname: wf } = wfStartPointerInfo(pointer)
  persistence.enqueueWF({ id, startParams: payload, domain, srv, wf, parentWf: opts?.parentWf })
  // const pointerWithId: NoWildPointer<Point> = { ...pointer, path: [...pointer.path, id] }
  await publishWf({ pointer, id, payload, opts })
  return id
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
    handler: async ({ payload, msg }) => {
      const info = wfLifeMsgRoutingInfo(msg)
      _log('consumeWf', info, pointer, payload)
      if (info.wfname !== pointer.path[4] || info.service !== pointer.path[2]) {
        const p = { t: info.type, p: payload }
        _log('consumeWf --- ', p)
        unbindQ({
          ex: await getDomainExchangeName(info.domain),
          name: pathTopic(pointer.path),
          topic: pathTopic(pointer.path),
        })
        return handler({ payload: p, info })
      } else {
        return handler({ payload, info })
      }
    },
    opts,
  })
}
export const consumeWfStart = async <Point extends Pointer<PathTo.WFStart, any, any, any, any>>(_: {
  pointer: Point
  handler: (_: { payload: Point['payload']; info: WfStartMsgRoutingInfo }) => Ack | Promise<Ack>
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
}) => {
  const { pointer: _pointer, handler, opts } = _
  const pointer: Point = { ..._pointer, path: [..._pointer.path, '*'] }
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
  const { /* domainName,ex, */ qName, topic } = await bindPointer({ dest: { point: pointer } })
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

        const payload = buffer2Json<Point['payload']>(msg.content)
        const ack = await handler({ payload, msg })
        ch[ack](msg)
      } catch (err) {
        console.error(err)
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

export const callSync = <Point extends Pointer<PathTo.WFStart, any, any, any, any>>(_: {
  pointer: NoWildPointer<Point>
  payload: Point['type']
  opts?: {
    timeout?: number
    start?: DomainWfStartOpts
    consume?: DomainConsumeOpts
    queue?: DomainQueueOpts
  }
}): Promise<TypeUnion<Point['parentType']['end']>> =>
  new Promise(async (resolve, reject) => {
    const { payload, pointer, opts } = _
    const to = setTimeout(() => reject('timeout'), opts?.timeout || 5000)
    const qname = newUuid()
    const id = await publishWfStart({
      pointer,
      payload,
      opts: { ...opts?.start },
    })
    const unsub = await consumeWf({
      pointer: { path: [...pointer.path.slice(0, -1), 'end', '*'] } as any,
      id,
      handler: (end) => {
        clearTimeout(to)
        unsub()
        resolve(end as any)
        return 'ack'
      },
      opts: {
        queue: { name: qname, ...opts?.queue },
        consume: { ...opts?.consume, exclusive: true },
      },
    })
  })

export const spawnWf = async <
  Spawn extends Pointer<PathTo.WFStart, any, any, any, any>,
  End extends Pointer<PathTo.WFEnd, any, any, any, any>,
  Dest extends End extends Pointer<PathTo.WFEnd, any, any, any, any, infer T>
    ? Pointer<PathTo.WFSignal, T, any, any, any>
    : never
>(_: {
  parentWf: string
  spawnPointer: NoWildPointer<Spawn>
  sigPointer: NoWildPointer<Dest>
  payload: Spawn['type']
  opts?: {
    spawn?: DomainWfStartOpts
    bind?: DomainQueueOpts
    args?: any
  }
}) => {
  const { payload, sigPointer, spawnPointer, opts, parentWf } = _
  const verWfId = await publishWfStart({
    pointer: spawnPointer,
    payload: payload,
    opts: {
      parentWf,
    },
  })
  const endPointer = { path: [...spawnPointer.path.slice(0, -1), 'end', '*'] }
  const src = { id: verWfId, point: endPointer } as any
  const dest = { id: '*', point: sigPointer } as any

  bindPointer({ dest, src, args: opts?.args, opts: opts?.bind })
  return
}
export const bindPointer = async <
  Dest extends Pointer<any, any, any, any, any>,
  Src extends Dest extends Pointer<any, infer DestType, any, any, any>
    ? Pointer<any, any, any, any, any, DestType>
    : never
>(_: {
  dest: { point: Dest; id?: string }
  src?: { point: Src; id: string }
  args?: any
  opts?: DomainQueueOpts
}) => {
  const { dest, src, args, opts } = _
  const destPoint = {
    ...dest.point,
    path: dest.id ? [...dest.point.path, dest.id] : dest.point.path,
  }
  const qName = pathTopic(destPoint.path)
  const domainName = pathDomainName((src?.point || destPoint).path)
  const topic = pathTopic(
    (src ? { ...src.point, path: [...src.point.path, src.id] } : destPoint).path
  )
  const ex = await getDomainExchangeName(domainName)
  _log({ _: 'Binding', qName, topic, ex })
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
