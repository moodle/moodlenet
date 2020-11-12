// import { delay } from 'bluebird'
import { ConsumeMessage, Options } from 'amqplib'
import { newUuid } from '../helpers/misc'
import { channelPromise as channel } from './domain.env'
import { mockDomainPersistence as persistence } from './persistence/mock'
import {
  AnyDomainWFMessage,
  Domain,
  DomainName,
  DomainWFEndMessage,
  DomainWFMessage,
  DomainWFProgressMessage,
  DomainWFStartMessage,
  EventNames,
  EventPayload,
  ServiceNames,
  TopicWildCard,
  WFLifeCycle,
  WFMeta,
  WFState,
  WorkflowContext,
  WorkflowEndProgress,
  WorkflowNames,
  WorkflowProgress,
  WorkflowStartParams
} from './types'

const getDomainExchangeName = (domainName: string) => `Domain.${domainName}`
const stateGetter = <D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: { id: string }) => () => persistence.getWFState<D, S, W>(_)


/**
 *
 */
export const enqueue = <D extends Domain>(domainName: DomainName<D>) =>
  async<
    S extends ServiceNames<D>,
    W extends WorkflowNames<D, S>
  // SE extends ServiceNames<D>,
  // WFE extends WorkflowNames<D, SE>,
  // SIGE extends SignalNames<D, SE, WFE>
  >(_: {
    wf: `${S}.${W}`,
    startParams: WorkflowStartParams<D, S, W>,
    opts?: { wfid?: string }

    //TODO : add notifyEnd -> wf#ctx
    // notifyEnd: SignalPayload<D, SE, WFE, SIGE> extends WorkflowEndPayload<D, S, WF>
    //   ? `${SE}.${WFE}.${SIGE}`
    //   : never
  }) => {
    const { wf, startParams, opts } = _
    const id = opts?.wfid || newUuid()
    const topic = makeWfStartTopic(wf)
    _log(`enqueue ${topic} ${id}`, startParams)

    const ch = await channel
    const done = await ch.publish(getDomainExchangeName(domainName), topic, domainWFMessage2Buffer<D, S, W, DomainWFStartMessage<D, S, W>>(/* BEWARE: can't check this */{ id, startParams }))
    if (!done) {
      throw new Error(`couldn't enqueue`)
    }

    // FIXME : how to value ctx  here or where ?
    // @ts-ignore
    (persistence as any).enqueueWF({ id, startParams })

    return id
  }

/**
 *
 */
export const bindWFProgress = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string,
    wf: `${S}.${W}`,
    handler: (_: {
      progress: WorkflowProgress<D, S, W>,
      meta: WFMeta,
      state: () => Promise<WFState<D, S, W>>,
      doProgress: (_: {
        progress: WorkflowProgress<D, S, W>,
        ctx?: WorkflowContext<D, S, W>
      }) => unknown,
      doEnd: (_: { endProgress: WorkflowEndProgress<D, S, W>, ctx?: WorkflowContext<D, S, W> }) => unknown,
    }) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  }) => {
    const { wf, id, handler, opts } = _
    const topic = makeWfTopic(wf, id, 'progress', '*')
    _log(`bindWFProgress ${topic}`)


    return makeDomainQueueConsumer<D>(domainName)({
      opts,
      topic,
      consumer: async (msg) => {
        const { id, progress } = buffer2DomainWFMessage<D, S, W, DomainWFProgressMessage<D, S, W>>(msg.content)
        const doProgress = (_progressData: {
          progress: WorkflowProgress<D, S, W>,
          ctx?: WorkflowContext<D, S, W>
        }) => progressWF<D>(domainName)<S, W>({ wf, id, ..._progressData })

        const doEnd = (_endData: {
          endProgress: WorkflowEndProgress<D, S, W>,
          ctx?: WorkflowContext<D, S, W>
        }) => endWF<D>(domainName)<S, W>({ wf, id, ..._endData })

        handler({
          meta: { id: id },
          progress,
          state: stateGetter<D, S, W>({ id }),
          doProgress,
          doEnd,
        })
      },
    })
  }

/**
 *
 */
export const bindWFEnd = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    wf: `${S}.${W}`,
    id: string,
    handler: (_: {
      endProgress: WorkflowEndProgress<D, S, W>,
      meta: WFMeta,
      state: () => Promise<WFState<D, S, W>>,
    }) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  }) => {
    const { wf, id, handler, opts } = _
    const topic = makeWfTopic(wf, id, 'end', '*')
    _log(`bindWFEnd ${topic}`)

    return makeDomainQueueConsumer<D>(domainName)({
      opts,
      topic,
      consumer: async (msg) => {
        const { id, endProgress } = buffer2DomainWFMessage<D, S, W, DomainWFEndMessage<D, S, W>>(msg.content)
        handler({ endProgress, state: stateGetter({ id }), meta: { id } })
      },
    })
  }

/**
 *
 */
export const bindWF = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    wf: `${S}.${W}`,
    id: string,
    handler: (_: ({ endProgress: WorkflowEndProgress<D, S, W> } | { progress: WorkflowProgress<D, S, W> }) & {
      state: () => Promise<WFState<D, S, W>>,
      meta: WFMeta
    }) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  }) => {
    const { wf, id, handler, opts, } = _
    const topic = makeWfTopic(wf, id, '*', '*')
    _log(`bindWF ${topic}`)

    return makeDomainQueueConsumer<D>(domainName)({
      opts,
      topic,
      consumer: async (msg) => {
        const anyProgress = buffer2DomainWFMessage<D, S, W, DomainWFMessage<D, S, W>>(msg.content)
        handler({ ...anyProgress, state: stateGetter({ id }), meta: { id } })
      },
    })
  }

/**
 *
 */
export const bindEV = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, EV extends EventNames<D, S>>(_: {
    ev: `${S}.${EV}`,
    handler: (event: EventPayload<D, S, EV>) => unknown,
    opts?: { qname?: string; consume?: Options.Consume; queue?: Options.AssertQueue }
  }) => {
    const { ev, handler, opts, } = _
    const topic = makeEvTopic(ev)
    _log(`bindEV ${topic}`)
    return makeDomainQueueConsumer<D>(domainName)({
      opts,
      topic,
      consumer: async (msg) => {
        //TODO : Events to be done and type managed
        const event = buffer2DomainEVMessage<D, S, EV>(msg.content)
        handler(event)
      },
    })
  }

/**
 *
 */
export const progressWF = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    wf: `${S}.${W}`,
    id: string,
    progress: WorkflowProgress<D, S, W>,
    ctx?: WorkflowContext<D, S, W>
  }) => {
    const { wf, id, progress, ctx, } = _
    await persistence.progressWF<D, S, W>({
      id: id,
      ctx,
      progress
    })
    const topic = makeWfTopic(wf, id, 'progress', progress._type)
    _log(`progress ${topic}`, progress)
    return (await channel).publish(getDomainExchangeName(domainName), topic, domainWFMessage2Buffer<D, S, W, DomainWFProgressMessage<D, S, W>>(/* BEWARE: can't check this */{ id, progress }))
  }

/**
 *
 */
export const endWF = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    wf: `${S}.${W}`,
    id: string,
    endProgress: WorkflowEndProgress<D, S, W>,
    ctx?: WorkflowContext<D, S, W>
  }) => {
    const { wf, id, endProgress, ctx, } = _
    const topic = makeWfTopic(wf, id, 'end', endProgress._type)

    _log(`end ${topic}`, endProgress, ctx)
    await persistence.endWF({
      id,
      ctx,
      endProgress,
    })
    return (await channel).publish(getDomainExchangeName(domainName), topic, domainWFMessage2Buffer<D, S, W, DomainWFEndMessage<D, S, W>>(/* BEWARE: can't check this */{ id, endProgress }))
  }

/**
 *
 */
export const consumeWF = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    wf: `${S}.${W}`,
    consumer: (_: {
      startParams: WorkflowStartParams<D, S, W>,
      doProgress: (_: {
        progress: WorkflowProgress<D, S, W>,
        ctx: WorkflowContext<D, S, W>
      }) => unknown,
      doEnd: (_: { endProgress: WorkflowEndProgress<D, S, W>, ctx: WorkflowContext<D, S, W> }) => unknown,
      meta: WFMeta
    }) => unknown,
    opts?: { qname?: string | true; consume?: Options.Consume; queue?: Options.AssertQueue }
  }) => {
    const { wf, consumer, opts, } = _
    // const [srv,wf] = split(wfPath)
    const topic = makeWfStartTopic(wf)
    const qname = opts?.qname
      ? opts.qname === true
        ? `CONSUMER:${domainName}.${topic}`
        : opts.qname
      : newUuid()
    return makeDomainQueueConsumer<D>(domainName)({
      topic,
      opts: { qname, queue: { durable: true, ...opts?.queue }, consume: { ...opts?.consume } },
      consumer: async (msg) => {
        const { id, startParams } = buffer2DomainWFMessage<D, S, W, DomainWFStartMessage<D, S, W>>(msg.content)

        const doProgress = (_progress: {
          progress: WorkflowProgress<D, S, W>,
          ctx: WorkflowContext<D, S, W>
        }) => progressWF<D>(domainName)<S, W>({ wf, id, ..._progress })

        const doEnd = (_end: { endProgress: WorkflowEndProgress<D, S, W>, ctx: WorkflowContext<D, S, W> }) =>
          endWF<D>(domainName)<S, W>({ id, wf, ..._end })

        consumer({ startParams, doProgress, doEnd, meta: { id } })
      },
    })
  }

/**
 *
 */
export const makeDomainQueueConsumer = <D extends Domain>(domainName: DomainName<D>) =>
  async (_: {
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
    await ch.bindQueue(aq.queue, getDomainExchangeName(domainName), topic)
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
export const callSync = <D extends Domain>(domainName: DomainName<D>) =>
  async<S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    wf: `${S}.${W}`,
    startParams: WorkflowStartParams<D, S, W>
  }) =>
    new Promise<{
      state: () => Promise<WFState<D, S, W>>
      endProgress: WorkflowEndProgress<D, S, W>
      meta: WFMeta
    }>(async (resolve, _reject) => {
      const { wf, startParams } = _
      const id = newUuid()
      const unsub = await bindWFEnd<D>(domainName)<S, W>({
        wf,
        id,
        handler: ({ endProgress, meta, state }) => {
          resolve({ state, endProgress, meta })
          unsub()
        },
        opts: { queue: { exclusive: true }, consume: { exclusive: true } }
      })
      // await delay(1000)
      enqueue<D>(domainName)<S, W>({ wf, startParams, opts: { wfid: id } })
    })

export const domain = <D extends Domain>(domainName: DomainName<D>) => ({
  enqueue: enqueue<D>(domainName),
  bindWFProgress: bindWFProgress<D>(domainName),
  bindWFEnd: bindWFEnd<D>(domainName),
  bindWF: bindWF<D>(domainName),
  bindEV: bindEV<D>(domainName),
  progress: progressWF<D>(domainName),
  end: endWF<D>(domainName),
  consumeWF: consumeWF<D>(domainName),
  makeDomainQueueConsumer: makeDomainQueueConsumer<D>(domainName),
  callSync: callSync<D>(domainName),
})

const domainWFMessage2Buffer = <
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  T extends AnyDomainWFMessage<D, S, W>
>(json: T) => Buffer.from(JSON.stringify(json))

const buffer2DomainWFMessage = <
  D extends Domain,
  S extends ServiceNames<D> = ServiceNames<D>,
  W extends WorkflowNames<D, S> = WorkflowNames<D, S>,
  T extends AnyDomainWFMessage<D, S, W> = AnyDomainWFMessage<D, S, W>,
  >(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

// const domainEVMessage2Buffer = <
//   D extends Domain,
//   S extends ServiceNames<D>,
//   E extends EventNames<D, S>,
//   >(json: EventPayload<D, S, E>) => Buffer.from(JSON.stringify(json))

const buffer2DomainEVMessage = <
  D extends Domain,
  S extends ServiceNames<D>,
  E extends EventNames<D, S>,
  >(buf: Buffer): EventPayload<D, S, E> => JSON.parse(buf.toString('utf-8'))

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
