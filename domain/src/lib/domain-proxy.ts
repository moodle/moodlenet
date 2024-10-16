import { _any, path, unsupportedProxyHandler } from '@moodle/lib-types'
import { MoodleDomain } from '../moodle-domain'
import { domainMsg } from '../types/msg'

export function createMoodleDomainProxy({
  ctrl,
}: {
  ctrl(domainProxyCtrlArg: { domainMsg: domainMsg }): Promise<_any>
}): MoodleDomain {
  const moodleDomain = domain_proxy([]) as unknown as MoodleDomain
  return moodleDomain
  function domain_proxy(endpoint: path) {
    const proxy = new Proxy(() => null, {
      ...unsupportedProxyHandler(),
      get(_target, prop) {
        if (typeof prop !== 'string') {
          throw new TypeError(`${String(prop)} not here`)
        }
        return domain_proxy([...endpoint, prop])
      },
      apply(_target, _thisArg, [payload]) {
        return ctrl({ domainMsg: { endpoint, payload } })
      },
    })
    return proxy
  }
}
