import { unsupportedProxyHandler } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

const INSPECT_SYM = Symbol('MoodleDomainProxy inspect symbol')

export const makePrimaryProxy = makeDomainProxy<moo.Primary>
export const makeModelProxy = makeDomainProxy<moo.Model>

export function makeDomainProxy<proxyType>(exec: (path: string[], message: unknown) => Promise<unknown>): proxyType {
  return primary([]) as unknown as proxyType

  function primary(path: string[]) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (prop === INSPECT_SYM) {
          return path
        }
        if (typeof prop !== 'string') {
          throw new TypeError(`Invalid property ${String(prop)}`)
        }
        return primary([...path, prop])
      },
      apply(_target, _thisArg, [message]) {
        return exec(path, message)
      },
    })
  }
}
