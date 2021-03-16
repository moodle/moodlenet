// import { MoodleNetDomain } from '../../../../MoodleNetDomain/MoodleNetDomain'
import { defaultSubConfig, SubDef, SubscriberService } from '../../sub'
import { DomainStart, DomainStartSub, DomainStartWrk } from '../../types'
import { defaultWrkConfig, WorkerService, WrkDef } from '../../wrk'
import { getDefaultDomainName } from '../env'
import { getRegisteredImpl } from '../helpers'
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

export const start = async (domainStart: DomainStart<any>, domainName = getDefaultDomainName()) => {
  console.log(`\n\n start ${domainName}\n`)
  const impl = getRegisteredImpl(domainName)
  if (!impl) {
    throw new Error(`no impl:'${domainName}' registered !`)
  }
  const thisRunningDomain = runningDomains[domainName] || (runningDomains[domainName] = {})
  await Object.keys(domainStart).reduce<Promise<void>>(
    (last, path) =>
      last.then(async () => {
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
        console.log(`* ${path} started\n`)
        // return thisRunningDomain[path]
      }),
    Promise.resolve(),
  )
}

const bind = async (
  domainName: string,
  path: string,
  def: WrkDef<any> | SubDef<any, any>,
  start: DomainStartWrk<any, any> | DomainStartSub<any, any>,
) => {
  if (def.kind === 'wrk') {
    const cfg = defaultWrkConfig(def.cfg)
    const srv = await start.init({ cfg }).catch(manageInit(path, domainName))
    const unbind = await bindWorker(domainName, srv, path, cfg)
    return { unbind, srv }
  } else if (def.kind === 'sub') {
    const cfg = defaultSubConfig(def.cfg)
    const srv = await start.init({ cfg }).catch(manageInit(path, domainName))
    const unbind = await bindSubscriber(domainName, srv, path, cfg)
    return { unbind, srv }
  } else {
    throw new Error(`can't digest start item kind: ${((def || {}) as any).kind}`)
  }
}
const manageInit = (path: string, domainName: string) => (err: any) => {
  console.error(`Error initializing ${domainName}#${path}`)
  throw err
}
