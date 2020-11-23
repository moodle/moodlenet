// import { delay } from 'bluebird'
import { nodeLogger } from '.'
import { newUuid } from '../helpers/misc'
import { Acks, domainConsume, domainPublish, DomainPublishOpts } from './amqp'
import {} from './domain'
import { persistence } from './domain.env'
import { Path } from './transport/types'
import { Domain, Workflow } from './types'

const log = nodeLogger('transport')('apis')

// const workflowPath = ({ dom, srv, wf }: Workflow.Route<any, any, any>): Path => [dom, srv, 'wf', wf]
// const workflowPathId = (_: Workflow.RouteId<any, any, any>): Path => [...workflowPath(_), _.id]

export type ReplyManagedErrors<T> =
  | T
  | { t: '_ReplyManagedErrors'; p: 'Timeout' | 'Rejected' | 'Unknown' | 'Could not Deliver' }

export type PubCallOpts = DomainPublishOpts & {}
export const startWorkflow = async <
  Dom extends Domain,
  Srv extends keyof Dom['srv'],
  Wf extends keyof Dom['srv'][Srv]['wf']
>(_: {
  route: Workflow.Route<Dom, Srv, Wf>
  params: Workflow.StartType<Dom, Srv, Wf>
  opts?: PubCallOpts & {
    signalEnd?: Workflow.RouteSignalIn<
      any,
      any,
      any,
      any,
      Workflow.LifeTypeUnion<Dom, Srv, Wf, 'end', '*'>
    >
  }
}) => {
  const { params: startParams, route, opts } = _
  const id = newUuid()
  const path = wfStartPath({ ...route, id })
  persistence.enqueueWF({ ...route, id, startParams, signalEnd: opts?.signalEnd })
  await domainPublish({
    path,
    payload: startParams,
    opts: {
      delay: opts?.delay,
    },
  })
}
const wfStartPath = ({ dom, id, srv, wf }: Workflow.RouteId<any, any, any>): Path => [
  dom,
  srv,
  'wf',
  wf,
  id,
  'start',
]
const wfStagePath = ({
  dom,
  id,
  srv,
  wf,
  stg,
  stgName,
}: { stg: 'progress' | 'end'; stgName: string } & Workflow.RouteId<any, any, any>): Path => [
  dom,
  srv,
  'wf',
  wf,
  id,
  stg,
  stgName,
]

// type a = Workflow.LifeTypeUnion<MoodleNetDomain, 'Email', 'VerifyEmail', 'end', '*'>
// type b = Workflow.LifeTypeUnion<MoodleNetDomain, 'Accounting', 'RegisterNewAccount', 'signal', 'EmailConfirmationResult'>['p']

// type S = Workflow.RouteSignalIn<MoodleNetDomain, 'Accounting', 'RegisterNewAccount', 'EmailConfirmationResult'>
// declare const sig: S
// sig
// startWorkflow<MoodleNetDomain, 'Email', 'VerifyEmail'>({
//   route: { dom: 'MoodleNet', srv: 'Email', wf: 'VerifyEmail' }, params: { email: { to: '' }, maxAttempts: 1., tokenReplaceRegEx: '' }, opts: {
//     signalEnd: sig
//   }
// })

export type ConsumerReply<T> = T | 'nack' | 'reject'
export type ConsumeStartOpts = {}
export const consumeStartWorkflow = async <
  Dom extends Domain,
  Srv extends keyof Dom['srv'] = keyof Dom['srv'],
  Wf extends keyof Dom['srv'][Srv]['wf'] = keyof Dom['srv'][Srv]['wf']
>(_: {
  route: Workflow.Route<Dom, Srv, Wf>
  handler: (_: {
    params: Workflow.StartType<Dom, Srv, Wf, 'in'>
  }) => ConsumerReply<Workflow.StartType<Dom, Srv, Wf, 'reply'>>
  opts?: ConsumeStartOpts
}): Promise<Workflow.StartType<Dom, Srv, Wf, 'reply'>> => {
  const { handler, route, opts } = _
  const { dom, srv, wf } = route
  const consumerQName = `STARTWF:$`
  return domainConsume({
    dom,
    srv,
    handler: async ({ payload, msg }) => {
      const info = wfLifeMsgRoutingInfo(msg)
      log('consumeWf', info, pointer, payload)
      if (info.wfname !== pointer.path[4] || info.service !== pointer.path[2]) {
        const p = { t: info.type, p: payload }
        log('consumeWf --- ', p)
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
  })
}

// declare const s: Workflow.StartType<MoodleNetDomain, 'Accounting', 'RegisterNewAccount', 'in'>

//   declare const i: Workflow.LifeTypeUnion<
//     MoodleNetDomain,
//     'Accounting',
//     'RegisterNewAccount',
//     'start'
//   >

//   i.t !== '' ? i.p.in1 : i.p.in2

//   declare const o: Workflow.ReplyTypeUnion<
//     MoodleNetDomain,
//     'Accounting',
//     'RegisterNewAccount',
//     'progress',
//     'aWaitingConfirmEmail' | 'WaitingConfirmEmail'
//   >

//   o.t !== 'WaitingConfirmEmail' ? o.p.rep2 : o.p.rep1

export type DomainWfProgressOpts = {
  delay?: number
}
export const progressWorkflow = async <
  Dom extends Domain,
  Srv extends keyof Dom['srv'] = keyof Dom['srv'],
  Wf extends keyof Dom['srv'][Srv]['wf'] = keyof Dom['srv'][Srv]['wf']
>(_: {
  route: [dom: Dom['name'], srv: Srv, wf: Wf, id: string]
  progress: Workflow.ProgInTypeUnion<Dom, Srv, Wf>
  opts?: DomainWfProgressOpts
}) => {
  const { progress, route, opts } = _
  const [domain, service, workflow, id] = route
  persistence.progressWF({ id, progress })
  await domainPublish({
    dom: domain,
    srv: service,
    topic: `${service}.${workflow}.${id}.progress.${progress.t}`,
    payload: progress.p,
    opts: { delay: opts?.delay },
  })
  return id
}

export type DomainWfEndOpts = {
  delay?: number
}
export const endWorkflow = async <
  Dom extends Domain,
  Srv extends keyof Dom['srv'] = keyof Dom['srv'],
  Wf extends keyof Dom['srv'][Srv]['wf'] = keyof Dom['srv'][Srv]['wf']
>(_: {
  route: [Dom['name'], Srv, Wf]
  end: Workflow.EndTypeUnion<Dom, Srv, Wf>
  opts?: DomainWfEndOpts
}) => {
  const { end, route, opts } = _
  const [domain, service, workflow] = route
  const id = newUuid()
  persistence.endWF({ id, end })
  await domainPublish({
    dom: domain,
    srv: service,
    topic: `${service}.${workflow}`,
    payload: end,
    opts: { delay: opts?.delay },
  })
  return id
}
