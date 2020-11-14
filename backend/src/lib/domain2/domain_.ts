// import { delay } from 'bluebird'
import { Options } from 'amqplib'
import { newUuid } from '../helpers/misc'
import { channelPromise as channel } from './domain.env'
import { mockDomainPersistence as persistence } from './persistence/mock'
import {
  Domain,
  DomainEventMessageContent,
  DomainMessageContent,
  DomainName,
  DomainWfMessageContent,
  EventNames,
  EventPayload,
  ServiceNames,
  TopicWildCard,
  WorkflowEnd,
  WorkflowEndNames,
  WorkflowNames,
  WorkflowProgress,
  WorkflowProgressNames,
  WorkflowStartParams,
} from './types'

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
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
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
const publish = <Msg extends DomainMessageContent<any>>(
  domainName: string,
  topic: string
) => async (msg: Msg, opts?: DomainPublishOpts) => {
  _log(`publish ${topic}`, msg)
  return (await channel).publish(
    await getDomainExchangeName(domainName),
    topic,
    json2Buffer(msg),
    opts
  )
}

const consume = <Msg extends DomainMessageContent<any>>(
  domainName: string,
  topic: string
) => async (
  handler: (_: Msg, topic: string) => Ack | Promise<Ack>,
  opts?: { consume?: DomainConsumeOpts; queue?: DomainQueueOpts }
) => {
  _log(`consume ${topic}`)
  const ch = await channel
  const qname = opts?.consume?.static || newUuid()
  const rejectStrategy = opts?.consume?.rejectStrategy || 'reject'
  await ch.assertQueue(qname, {
    ...opts?.queue,
    exclusive: true,
  })
  await ch.bindQueue(qname, await getDomainExchangeName(domainName), topic)

  const cons = await ch.consume(
    qname,
    async (msg) => {
      if (!msg) {
        return
      }
      try {
        const ack = await handler(buffer2Json(msg.content), msg.fields.routingKey)
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
// Domain
// Srvname
//                        wf                                |             ev
//                                                      SectorName
//   end        |      progress       |     start           |          evPayload
//             Name                   |   StartParams       |____________________
//           Payload                  |_____________________|

export const d = <D extends Domain>(domainName: DomainName<D>) => <S extends ServiceNames<D>>(
  srvName: S
) => {
  const servTopic = `${domainName}.${srvName}`

  return {
    ev: <E extends EventNames<D, S>>(evName: E) => `${servTopic}.ev.${evName}`,
    wf: <W extends WorkflowNames<D, S>>(wfName: W) => {
      const wfTopic = `${servTopic}.wf.${wfName}`
      return {
        start: (id: string) => `${wfTopic}.start.${id}`,
        progress: <ProgressTypeOrWild extends TopicWildCard | WorkflowProgressNames<D, S, W>>(
          progressType: ProgressTypeOrWild,
          id: string
        ) => `${wfTopic}.progress.${progressType}.${id}`,
        end: <EndTypeOrWild extends TopicWildCard | WorkflowEndNames<D, S, W>>(
          endType: EndTypeOrWild,
          id: string
        ) => `${wfTopic}.end.${endType}.${id}`,
      }
    },
  }
}

const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))

const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

const _log = (...args: any[]) =>
  console.log('DOM----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')
