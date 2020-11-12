// import { delay } from 'bluebird'
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
  DomainPersistence,
  WorkflowContext,
  WorkflowEndPayload,
  WorkflowNames,
  WorkflowPayload,
  WorkflowProgressPayload,
  WorkflowStartParams,
} from './types'


/**
 *
 */
export const enqueue2 = <D extends Domain>(domainName: DomainName<D>) => async<S extends ServiceNames<D> = ServiceNames<D>, WF extends WorkflowNames<D, S> = WorkflowNames<D, S>>
  (
    wfpath: `${S}.${WF}`,
    params: WorkflowStartParams<D, S, WF>,
    _uuid?: string
  ) => {
  const uuid = _uuid || newUuid()
  const topic = makeWfStartTopic(wfpath)
  _log(`enqueue2 ${topic} ${uuid}`, params)

  const ch = await channelPromise
  const done = await ch.publish(`Domain.${domainName}`, topic, json2Buffer(params), {
    messageId: uuid,
  })
  if (!done) {
    throw new Error(`couldn't enqueue`)
  }
  return uuid
}

export const make = <D extends Domain>(
  domainName: DomainName<D>,
  persistence: DomainPersistence
) => {
  const domainExchangeName = `Domain.${domainName}`
  const channel = channelPromise.then((ch) => (ch.assertExchange(domainExchangeName, 'topic'), ch))

  /**
   *
   */
  const enqueue = async <
    S extends ServiceNames<D>,
    WF extends WorkflowNames<D, S>
  // SE extends ServiceNames<D>,
  // WFE extends WorkflowNames<D, SE>,
  // SIGE extends SignalNames<D, SE, WFE>
  >(
    wfpath: `${S}.${WF}`,
    params: WorkflowStartParams<D, S, WF>,
    // TODO : metti tutto in opts?
    _uuid?: string
    //TODO : add notifyEnd -> wf#ctx
    // notifyEnd: SignalPayload<D, SE, WFE, SIGE> extends WorkflowEndPayload<D, S, WF>
    //   ? `${SE}.${WFE}.${SIGE}`
    //   : never
  ) => {
    const uuid = _uuid || newUuid()
    const topic = makeWfStartTopic(wfpath)
    _log(`enqueue ${topic} ${uuid}`, params)

    const ch = await channel
    const done = await ch.publish(domainExchangeName, topic, json2Buffer(params), {
      messageId: uuid,
    })
    if (!done) {
      throw new Error(`couldn't enqueue`)
    }
    return uuid
  }

  /**
   *
   */
  const bindWFProgress = <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfpath: `${S}.${W}`,
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
    const topic = makeWfTopic(wfpath, wfid, 'progress', '*')
    _log(`bindWFProgress ${topic}`)

    const _progress = (wfid: string) => (
      payload: WorkflowProgressPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>
    ) => progress<S, W>(wfpath, wfid, payload, ctx)
    const _end = (_wfid: string) => (
      payload: WorkflowEndPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>
    ) => end<S, W>(wfpath, _wfid, payload, ctx)
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

  /**
   *
   */
  const bindWFEnd = <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfpath: `${S}.${W}`,
    wfid: string,
    handler: (
      payload: WorkflowEndPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>,
      meta: WFMeta
    ) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeWfTopic(wfpath, wfid, 'end', '*')
    _log(`bindWFEnd ${topic}`)

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

  /**
   *
   */
  const bindWF = <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfpath: `${S}.${W}`,
    wfid: string,
    handler: (
      payload: WorkflowPayload<D, S, W>,
      ctx: WorkflowContext<D, S, W>,
      meta: WFMeta
    ) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeWfTopic(wfpath, wfid, '*', '*')
    _log(`bindWF ${topic}`)

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

  /**
   *
   */
  const bindEV = <S extends ServiceNames<D>, EV extends EventNames<D, S>>(
    evpath: `${S}.${EV}`,
    handler: (payload: EventPayload<D, S, EV>) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  ) => {
    const topic = makeEvTopic(evpath)
    _log(`bindEV ${topic}`)
    return makeConsumer({
      opts,
      topic,
      consumer: async (msg) => {
        const payload = buffer2Json(msg.content)
        handler(payload)
      },
    })
  }

  /**
   *
   */
  const progress = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfpath: `${S}.${W}`,
    wfid: string,
    progress: WorkflowProgressPayload<D, S, W>,
    ctx: WorkflowContext<D, S, W>
  ) => {
    await persistence.saveWFState(wfid, {
      ctx,
      state: progress,
    })
    const topic = makeWfTopic(wfpath, wfid, 'progress', progress._type)
    const msg = { payload: progress, meta: { wfid } }
    _log(`progress ${topic}`, msg)
    return (await channel).publish(domainExchangeName, topic, json2Buffer(msg))
  }

  /**
   *
   */
  const end = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfpath: `${S}.${W}`,
    wfid: string,
    end: WorkflowEndPayload<D, S, W>,
    ctx: WorkflowContext<D, S, W>
  ) => {
    const topic = makeWfTopic(wfpath, wfid, 'end', end._type)
    const msg = { payload: end, meta: { wfid } }
    _log(`end ${topic}`, msg)
    await persistence.endWF(wfid, {
      ctx,
      state: end,
    })
    return (await channel).publish(domainExchangeName, topic, json2Buffer(msg))
  }

  /**
   *
   */
  const consumeWF = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfpath: `${S}.${W}`,
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
    // const [srv,wf] = split(wfPath)
    const topic = makeWfStartTopic(wfpath)
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
        ) => progress<S, W>(wfpath, wfid, payload, ctx)

        const _end = (payload: WorkflowEndPayload<D, S, W>, ctx: WorkflowContext<D, S, W>) =>
          end<S, W>(wfpath, wfid, payload, ctx)

        consumer(buffer2Json(msg.content), _progress, _end, { wfid })
      },
    })
  }

  /**
   *
   */
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

  /**
   *
   */
  const callSync = async <S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfPath: `${S}.${W}`,
    params: WorkflowStartParams<D, S, W>
  ) =>
    new Promise<{
      ctx: WorkflowContext<D, S, W>
      endPayload: WorkflowEndPayload<D, S, W>
      meta: WFMeta
    }>(async (resolve, _reject) => {
      const wfuuid = newUuid()
      const unsub = await bindWFEnd<S, W>(
        wfPath,
        wfuuid,
        (endPayload, ctx, meta) => {
          resolve({ ctx, endPayload, meta })
          unsub()
        },
        { queue: { exclusive: true }, consume: { exclusive: true } }
      )
      // await delay(1000)
      enqueue<S, W>(wfPath, params, wfuuid)
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
    // TODO: signal()
  }
}

const json2Buffer = (json: any) => Buffer.from(JSON.stringify(json))

const buffer2Json = (buf: Buffer) => JSON.parse(buf.toString('utf-8'))

const makeWfTopic = (
  wfpath: string,
  uuid: string,
  action: WFLifeCycle | TopicWildCard,
  type: string
) => `WF:${wfpath}.${uuid}.${action}.${type}`

const makeEvTopic = (evpath: string) => `EV:${evpath}`
const makeWfStartTopic = (wfpath: string) => `WFSTART:${wfpath}`

// const split = <A=string,B=string,C=string,D=string,E=string>(path: string):[A,B,C,D,E] => path.split('.') as any
// const joinWfId = (_: { srv: string; wf: string; uuid: string }) =>
//   hasWildcards([_.srv, _.wf, _.uuid]) ? null : `${_.srv}.wf.${_.wf}.${_.uuid}`
// const splitWfId = (wfId: string) => {
//   const arr = wfId.split('.')
//   return arr.length >= 4 && arr[1] === 'wf' && hasWildcards(arr)
//     ? null
//     : { srv: arr[0], wf: arr[2], uuid: arr[3] }
// }
// const hasWildcards = (arr: string[]) => arr.filter((_) => _ === '*' || _ === '#').length > 0

const _log = (...args: any[]) =>
  console.log('DOM----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')
