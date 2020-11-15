// import { delay } from 'bluebird'
import { Options } from 'amqplib'
import { Last } from 'typescript-tuple'
import { newUuid } from '../helpers/misc'
import { channelPromise as channel } from './domain.env'
import { mockDomainPersistence as persistence } from './persistence/mock'
import { Domain, PathTo, Pointer } from './types'

const assertedExchanges = {} as any
const getDomainExchangeName = async (domainName: string) => {
  const exName = `Domain.${domainName}`
  if (!assertedExchanges[exName]) {
    ;(await channel).assertExchange(exName, 'topic')
  }
  return exName
}

const stateGetter = <
  D extends Domain,
  S extends keyof D['srv'],
  W extends keyof D['srv'][S]['wf']
>(_: {
  id: string
}) => () => persistence.getWFState<D, S, W>(_)

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

export const publish = async <Point extends Pointer<PathTo.AnyLeaf, any>>(
  pointer: Point,
  payload: Point extends Pointer<infer P, infer T> ? { t: Last<P>; p: T } : never,
  opts?: DomainPublishOpts
) => {
  const topicArr = pointer.p
  _log(`publish ${topicArr}`, payload)
  const ex = await getDomainExchangeName(topicArr[0])
  const pub = await (await channel).publish(ex, topicArr.join('.'), json2Buffer(payload), opts)
  return pub
}

export const publishEv = async <Point extends Pointer<PathTo.Event, any>>(
  pointer: Point,
  payload: Point extends Pointer<any, infer T> ? T : never,
  opts?: DomainPublishOpts
) => publish(pointer, payload, opts)

export const publishWf = async <Point extends Pointer<PathTo.WF, any>>(
  pointer: Point,
  id: string,
  payload: Point extends Pointer<any, infer T> ? T : never,
  // payload: Point extends Pointer<infer P, infer T> ? { t: Last<P>; p: T } : never,
  opts?: DomainPublishOpts
) => publish<Point>(({ p: [...pointer.p, id], _: pointer._ } as any) as Point, payload, opts)

export const publishWfStart = async <Point extends Pointer<PathTo.WFStart, any>>(
  pointer: Point,
  payload: Point extends Pointer<any, infer T> ? T : never,
  opts?: DomainPublishOpts
) => {
  const id = newUuid()
  ;(await publishWf(pointer, id, payload, opts)) && id
}

export const consumeEv = async <Point extends Pointer<PathTo.Event, any>>(
  pointer: Point,
  handler: (
    _: Point extends Pointer<infer P, infer T> ? { t: Last<P>; p: T } : never
  ) => Ack | Promise<Ack>,
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
) => consume<Point>(pointer, handler, opts)

export const consumeWf = async <Point extends Pointer<PathTo.WF, any>>(
  pointer: Point,
  id: string,
  handler: (
    _: Point extends Pointer<infer P, infer T> ? { t: Last<P>; p: T } : never
  ) => Ack | Promise<Ack>,
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
) => consume<Point>({ p: [...pointer.p, id], _: pointer._ } as any, handler, opts)

export const consume = async <Point extends Pointer<any, any>>(
  pointer: Point,
  handler: (
    _: Point extends Pointer<infer P, infer T> ? { t: Last<P>; p: T } : never
  ) => Ack | Promise<Ack>,
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
) => {
  const topicArr = pointer.p
  _log(`consume ${topicArr}`)
  const ch = await channel
  const ex = await getDomainExchangeName(topicArr[0])
  const qname = opts?.consume?.static || newUuid()
  const rejectStrategy = opts?.consume?.rejectStrategy || 'reject'
  await ch.assertQueue(qname, {
    ...opts?.queue,
    exclusive: true,
  })
  await ch.bindQueue(qname, ex, topicArr.join('.'))

  const cons = await ch.consume(
    qname,
    async (msg) => {
      if (!msg) {
        return
      }
      try {
        const ack = await handler(buffer2Json(msg.content))
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

export const splitWfProgressTopic = (topic: string) => {
  const [domain, service, , wfname, action, type, wfid] = topic.split('.')
  return { domain, service, wfname, action, type, wfid }
}
export const splitWfStartTopic = (topic: string) => {
  const [domain, service, , wfname, , wfid] = topic.split('.')
  return { domain, service, wfname, wfid }
}

const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))

const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

const _log = (...args: any[]) =>
  console.log('DOM----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')
