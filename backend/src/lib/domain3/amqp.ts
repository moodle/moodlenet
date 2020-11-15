// import { delay } from 'bluebird'
import { Options } from 'amqplib'
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

export const publish = async <Point extends Pointer<PathTo.AnyLeaf, any, any, any>>(
  pointer: Point,
  payload: Point['type'],
  opts?: DomainPublishOpts
) => {
  const topicArr = pointer.path
  const topic = topicArr.join('.')
  _log(`publish ${topic}`, payload)
  const ex = await getDomainExchangeName(topicArr[0])
  const pub = await (await channel).publish(ex, topic, json2Buffer(payload), opts)
  return pub
}

export const publishEv = async <Point extends Pointer<PathTo.Event, any, any, any>>(
  pointer: Point,
  payload: Point['type'],
  opts?: DomainPublishOpts
) => publish(pointer, payload, opts)

export const publishWf = async <Point extends Pointer<PathTo.WF, any, any, any>>(
  pointer: Point,
  id: string,
  payload: Point['type'],
  opts?: DomainPublishOpts
) => publish<Point>(({ path: [...pointer.path, id] } as any) as Point, payload, opts)

export const publishWfStart = async <Point extends Pointer<PathTo.WFStart, any, any, any>>(
  pointer: Point,
  payload: Point['type'],
  opts?: DomainPublishOpts
) => {
  const id = newUuid()
  ;(await publishWf(pointer, id, payload, opts)) && id
}

export const consumeEv = async <Point extends Pointer<PathTo.Event, any, any, any>>(
  pointer: Point,
  handler: (_: Point['payload']) => Ack | Promise<Ack>,
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
) => consume<Point>(pointer, handler, opts)

export const consumeWf = async <Point extends Pointer<PathTo.WF, any, any, any>>(
  pointer: Point,
  id: string,
  handler: (_: Point['payload']) => Ack | Promise<Ack>,
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
) => consume<Point>({ path: [...pointer.path, id] } as any, handler, opts)

export const consume = async <Point extends Pointer<PathTo.AnyLeaf, any, any, any>>(
  pointer: Point,
  handler: (_: Point['payload']) => Ack | Promise<Ack>,
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
) => {
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
        const ack = await handler({ p: jsonContent, t: payloadType })
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
