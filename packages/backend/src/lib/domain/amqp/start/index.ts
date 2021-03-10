// import { MoodleNetDomain } from '../../../../MoodleNetDomain/MoodleNetDomain'
import { Sub, SubLeaves, SubscriberService } from '../../sub'
import { defaultWrkConfig, WorkerService, Wrk, WrkLeaves } from '../../wrk'
import { DEFAULT_DOMAIN_NAME, getRegisteredImpl } from '../helpers'
import { bindSubscriber } from './bindSubscriber'
import { bindWorker } from './bindWorker'

type RunningServices = Record<
  string,
  { item: Wrk<any> | Sub<any, any>; srv: WorkerService<any> | SubscriberService<any, any>; unbind: () => void }
>
const runningDomains: Record<string, RunningServices> = {}

export type StartOpts = {}
export type StartServices<D> = Partial<{ [path in SubLeaves<D> | WrkLeaves<D>]: StartOpts }>
export const start = async <D>(services: StartServices<D>, domainName = DEFAULT_DOMAIN_NAME) => {
  const impl = getRegisteredImpl(domainName)
  if (!impl) {
    throw new Error(`no impl:'${domainName}' registered !`)
  }
  const thisRunningDomain = runningDomains[domainName] || (runningDomains[domainName] = {})
  const paths = Object.keys(services) as (SubLeaves<D> | WrkLeaves<D>)[]
  await Promise.all(
    paths.map(async path => {
      console.log(`starting ${path} worker`)

      const item = impl[path] as Wrk<any> | Sub<any, any> | undefined
      if (!item) {
        throw new Error(`impl[${path}] not implemented !`)
      }
      const { unbind, srv } = await bind(domainName, path, item)
      thisRunningDomain[path] = {
        item,
        srv,
        unbind,
      }
      console.log(`* ${path} started`)
      return thisRunningDomain[path]
    }),
  )
}

const bind = async (domainName: string, path: string, item: Wrk<any> | Sub<any, any>) => {
  const cfg = defaultWrkConfig(item.cfg)
  if (item.kind === 'wrk') {
    const srv = await item.init({ cfg })
    const unbind = await bindWorker(domainName, srv, path, cfg)
    return { unbind, srv }
  } else if (item.kind === 'sub') {
    const srv = await item.init({ cfg })
    const unbind = (
      await Promise.all([...new Set(item.events)].map(srcTopic => bindSubscriber(domainName, srv, srcTopic, path, cfg)))
    ).reduce((composed, unbind) => () => (composed(), unbind()))
    return { unbind, srv }
  } else {
    throw new Error(`can't digest start item kind: ${((item || {}) as any).kind}`)
  }
}
