import { any_, any_function, path, unsupportedProxyHandler } from '@moodle/lib-types'
import assert from 'assert'
import { MoodleDomain } from '../moodle-domain'
import { domainMsg } from '../types/msg'

const INSPECT_SYM = Symbol('MoodleDomainProxy inspect symbol')
export function createMoodleDomainProxy({
  ctrl,
}: {
  ctrl(domainProxyCtrlArg: { domainMsg: domainMsg }): Promise<any_>
}): MoodleDomain {
  const moodleDomain = domain_proxy([]) as unknown as MoodleDomain
  return moodleDomain
  function domain_proxy(endpoint: path) {
    const proxy = new Proxy(() => null, {
      ...unsupportedProxyHandler(),
      get(_target, prop) {
        if (prop === INSPECT_SYM) {
          return endpoint
        }
        if (typeof prop !== 'string') {
          throw new TypeError(`Invalid property ${String(prop)}`)
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

export function getProxyFnPath(proxy_function: any_function): path {
  const endpoint = (proxy_function as any_)[INSPECT_SYM]
  assert(Array.isArray(endpoint), `invalid proxy function [inspected endpoint=${endpoint}]`)
  return endpoint
}
