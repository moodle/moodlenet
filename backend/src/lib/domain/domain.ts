import { delay } from 'bluebird'
import { ConsumeMessage, Options } from 'amqplib'
import { newUuid } from '../helpers/misc'
import { channelPromise } from './domain.env'
import {
  Domain,
  DomainName,
  EventNames,
  EventPayload,
  ServiceNames,
  TopicWildCard,
  WFLifeCycle,
  WFMeta,
  WFPersistence,
  WorkflowContext,
  WorkflowEndPayload,
  WorkflowNames,
  WorkflowPayload,
  WorkflowProgressPayload,
  WorkflowStartParams,
} from './types'
const json2Buffer = (json: any) => Buffer.from(JSON.stringify(json))

const buffer2Json = (buf: Buffer) => JSON.parse(buf.toString('utf-8'))

export const make = <D extends Domain>(domainName: DomainName<D>, persistence: WFPersistence) => {
  const domainExchangeName = `Domain.${domainName}`
  const channel = channelPromise.then((ch) => (ch.assertExchange(domainExchangeName, 'topic'), ch))

  const enqueue = async <S extends ServiceNames<D>, WF extends WorkflowNames<D, S>>(
    srv: S,
    wf: WF,
    params: WorkflowStartParams<D, S, WF>,
    _uuid?: string
  ) => {
    const uuid = _uuid || newUuid()
    const topic = makeWfStartTopic(srv, wf)
    console.log(`enqueue ${topic} ${uuid}`, params)

    const ch = await channel
    const done = await ch.publish(domainExchangeName, topic, json2Buffer(params), {
      messageId: uuid,
    })
    if (!done) {
      throw new Error(`couldn't enqueue`)
    }
    return { srv, wf, uuid }
  }

  const bindWFProgress = <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    wfid: string,
    handler: (
      payload: WorkflowProgressPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>,
      progress: (
        payload: WorkflowProgressPayload<D, S, W>,
        ctx: WorkflowContext<D, S, W>
      ) => unknown,
      end: (payload: WorkflowEndPayload<D, S, W>, ctx: WorkflowContext<D, S, W>) => unknown,

      meta: WFMeta
    ) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeWfTopic(srv, wf, wfid, 'progress', '*')
    console.log(`bindWFProgress ${topic}`)

    const _progress = (wfid: string) => (
      payload: WorkflowProgressPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>
    ) => progress(srv, wf, wfid, payload, ctx)
    const _end = (_wfid: string) => (
      payload: WorkflowEndPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>
    ) => end(srv, wf, _wfid, payload, ctx)
    return makeConsumer({
      opts,
      topic,
      consumer: async (msg) => {
        const { payload, meta } = buffer2Json(msg.content)
        const state = await persistence.getLastWFState(meta.wfid)
        handler(payload, state.ctx, _progress(meta.wfid), _end(meta.wfid), meta)
      },
    })
  }
  const bindWFEnd = <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    wfid: string = '*',
    handler: (
      payload: WorkflowEndPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>,
      meta: WFMeta
    ) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeWfTopic(srv, wf, wfid, 'end', '*')
    console.log(`bindWFEnd ${topic}`)

    return makeConsumer({
      opts,
      topic,
      consumer: async (msg) => {
        const { payload, meta } = buffer2Json(msg.content)
        const state = await persistence.getLastWFState(meta.wfid)
        handler(payload, state.ctx, meta)
      },
    })
  }
  const bindWF = <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    uuid: string = '*',

    handler: (
      payload: WorkflowPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>,
      meta: WFMeta
    ) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeWfTopic(srv, wf, uuid, '*', '*')
    console.log(`bindWF ${topic}`)

    return makeConsumer({
      opts,
      topic,
      consumer: async (msg) => {
        const { uuid } = splitWfId(msg.fields.routingKey)!
        const state = await persistence.getLastWFState(uuid)
        const { payload, meta } = buffer2Json(msg.content)
        handler(payload, state.ctx, meta)
      },
    })
  }

  const bindEV = <S extends ServiceNames<D>, EV extends EventNames<D, S>>(
    srv: S, // | TopicWildCard = '*',
    ev: EV, // | TopicWildCard = '*'

    handler: (payload: EventPayload<D, S, EV>) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeEvTopic(srv, ev)
    console.log(`bindEV ${topic}`)
    return makeConsumer({
      opts,
      topic,
      consumer: async (msg) => {
        const payload = buffer2Json(msg.content)
        handler(payload)
      },
    })
  }

  const progress = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    wfid: string,
    progress: WorkflowProgressPayload<D, S, W>,
    ctx: WorkflowContext<D, S, W>
  ) => {
    await persistence.saveWFState(wfid, {
      ctx,
      state: progress,
    })
    const topic = makeWfTopic(srv, wf, wfid, 'progress', progress._type)
    const msg = { payload: progress, meta: { wfid } }
    console.log(`progress ${topic}`, msg)
    return (await channel).publish(domainExchangeName, topic, json2Buffer(msg))
  }

  const end = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    wfid: string,
    end: WorkflowEndPayload<D, S, W>,
    ctx: WorkflowContext<D, S, W>
  ) => {
    const topic = makeWfTopic(srv, wf, wfid, 'end', end._type)
    const msg = { payload: end, meta: { wfid } }
    console.log(`end ${topic}`, msg)
    await persistence.endWF(wfid, {
      ctx,
      state: end,
    })
    return (await channel).publish(domainExchangeName, topic, json2Buffer(msg))
  }

  const consumeWF = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    consumer: (
      params: WorkflowStartParams<D, S, W>,
      progress: (
        payload: WorkflowProgressPayload<D, S, W>,
        ctx: WorkflowContext<D, S, W>
      ) => unknown,
      end: (payload: WorkflowEndPayload<D, S, W>, ctx0: WorkflowContext<D, S, W>) => unknown,
      meta: WFMeta
    ) => unknown,
    opts?: { qname?: string | true; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeWfStartTopic(srv, wf)
    const qname = opts?.qname
      ? opts.qname === true
        ? `${domainName}.${topic}.CONSUMER`
        : opts.qname
      : newUuid()
    return makeConsumer({
      topic,
      opts: { qname, queue: { durable: true, ...opts?.queue }, consume: { ...opts?.consume } },
      consumer: async (msg) => {
        const wfid = msg.properties.messageId
        const _progress = (
          payload: WorkflowProgressPayload<D, S, W>,
          ctx: WorkflowContext<D, S, W>
        ) => progress(srv, wf, wfid, payload, ctx)
        const _end = (payload: WorkflowEndPayload<D, S, W>, ctx: WorkflowContext<D, S, W>) =>
          end(srv, wf, wfid, payload, ctx)

        consumer(buffer2Json(msg.content), _progress, _end, { wfid })
      },
    })
  }

  const makeConsumer = async (_: {
    topic: string
    consumer: (msg: ConsumeMessage) => Promise<void>
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  }) => {
    const { consumer, topic, opts } = _
    const ch = await channel
    const qname = opts?.qname || newUuid()
    const aq = await ch.assertQueue(qname, {
      ...opts?.queue,
    })
    await ch.bindQueue(aq.queue, domainExchangeName, topic)
    // await delay(1000)

    const cons = await ch.consume(
      aq.queue,
      async (msg) => {
        if (!msg) {
          return
        }
        await consumer(msg)
        ch.ack(msg)
      },
      {
        ...opts?.consume,
      }
    )

    return () => {
      ch.cancel(cons.consumerTag)
      ch.deleteQueue(qname)
    }
  }

  const callSync = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    srv: S,
    wf: W,
    params: WorkflowStartParams<D, S, W>
  ) =>
    new Promise<{
      ctx: WorkflowContext<D, S, W>
      endPayload: WorkflowEndPayload<D, S, W>
      meta: WFMeta
    }>(async (resolve, _reject) => {
      const wfuuid = newUuid()
      const unsub = await bindWFEnd(
        srv,
        wf,
        wfuuid,
        (endPayload, ctx, meta) => {
          resolve({ ctx, endPayload, meta })
          unsub()
        },
        { queue: { exclusive: true }, consume: { exclusive: true } }
      )
      // await delay(1000)
      enqueue(srv, wf, params, wfuuid)
    })

  return {
    enqueue,
    bindWFProgress,
    bindWFEnd,
    bindWF,
    consumeWF,
    progress,
    end,
    callSync,
    makeConsumer,
    bindEV,
  }
}

const makeWfTopic = (
  srv: string,
  wf: string,
  uuid: string,
  action: WFLifeCycle | TopicWildCard,
  type: string
) => `${srv}.${wf}.${uuid}.${action}.${type}`

const makeEvTopic = (srv: string, ev: string) => `${srv}.ev.${ev}`
const makeWfStartTopic = (srv: string, wf: string) => `${srv}.wfstart.${wf}`

// const joinWfId = (_: { srv: string; wf: string; uuid: string }) =>
//   hasWildcards([_.srv, _.wf, _.uuid]) ? null : `${_.srv}.wf.${_.wf}.${_.uuid}`
const splitWfId = (wfId: string) => {
  const arr = wfId.split('.')
  return arr.length >= 4 && arr[1] === 'wf' && hasWildcards(arr)
    ? null
    : { srv: arr[0], wf: arr[2], uuid: arr[3] }
}

const hasWildcards = (arr: string[]) => arr.filter((_) => _ === '*' || _ === '#').length > 0
