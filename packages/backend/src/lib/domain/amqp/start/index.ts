// import { MoodleNetDomain } from '../../../../MoodleNetDomain/MoodleNetDomain'
import { SubDef, SubscriberService } from '../../sub'
import { DomainStart, DomainStartSub, DomainStartWrk } from '../../types'
import { defaultWrkConfig, WorkerService, WrkDef } from '../../wrk'
import { DEFAULT_DOMAIN_NAME, getRegisteredImpl } from '../helpers'
import { bindSubscriber } from './bindSubscriber'
import { bindWorker } from './bindWorker'

type RunningServices = Record<
  string,
  {
    item: WrkDef<any> | SubDef<any, any>
    srv: WorkerService<any> | SubscriberService<any, any>
    unbind: () => void
  }
>
const runningDomains: Record<string, RunningServices> = {}

export const start = async (domainStart: DomainStart<any>, domainName = DEFAULT_DOMAIN_NAME) => {
  const impl = getRegisteredImpl(domainName)
  if (!impl) {
    throw new Error(`no impl:'${domainName}' registered !`)
  }
  const thisRunningDomain = runningDomains[domainName] || (runningDomains[domainName] = {})
  await Promise.all(
    Object.keys(domainStart).map(async path => {
      console.log(`starting ${path} worker`)

      const def = impl[path] as WrkDef<any> | SubDef<any, any> | undefined
      const start = domainStart[path]!

      if (!def) {
        throw new Error(`impl[${path}] not implemented !`)
      }

      const { unbind, srv } = await bind(domainName, path, def, start)
      thisRunningDomain[path] = {
        item: def,
        srv,
        unbind,
      }
      console.log(`* ${path} started`)
      return thisRunningDomain[path]
    }),
  )
}

const bind = async (
  domainName: string,
  path: string,
  def: WrkDef<any> | SubDef<any, any>,
  start: DomainStartWrk<any, any> | DomainStartSub<any, any>,
) => {
  const cfg = defaultWrkConfig(def.cfg)
  if (def.kind === 'wrk') {
    const srv = await start.init({ cfg })
    const unbind = await bindWorker(domainName, srv, path, cfg)
    return { unbind, srv }
  } else if (def.kind === 'sub') {
    const srv = await start.init({ cfg })
    const unbind = (
      await Promise.all([...new Set(def.events)].map(srcTopic => bindSubscriber(domainName, srv, srcTopic, path, cfg)))
    ).reduce((composed, unbind) => () => (composed(), unbind()))
    return { unbind, srv }
  } else {
    throw new Error(`can't digest start item kind: ${((def || {}) as any).kind}`)
  }
}
