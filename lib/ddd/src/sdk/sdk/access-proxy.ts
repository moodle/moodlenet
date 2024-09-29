import { _any } from '@moodle/lib-types'
import { Modules_v0_1 } from '../../domain'
import { domain_msg, layer_contexts } from '../../types'

export const _inspect_symbol = Symbol('moduleAccessProxy inspect')

export interface AccessPayload {
  domain_msg: domain_msg
}

export type domain_access = (_: AccessPayload) => unknown

//export type listener<ev extends event_layer>=()=>unknown
export interface AccessProxy {
  mod: Modules_v0_1
}
export interface DomainProxyCtrl {
  access: domain_access
}
function isFullLength(
  path: string[],
): path is [string, string, string, string, string, string, string] {
  return path.length == 7
}
export function createAcccessProxy(ctrl: DomainProxyCtrl): AccessProxy {
  const mod = mod_access_proxy([])
  return { mod }

  function mod_access_proxy(path: string[]) {
    if (isFullLength(path)) {
      return function call(payload: _any) {
        const domain_msg: domain_msg = {
          version: path[0],
          ns: path[1],
          mod: path[2],
          layer: path[3] as keyof layer_contexts,
          channel: path[4],
          port: path[5],
          payload,
        }
        if (payload === _inspect_symbol) {
          return domain_msg
        }

        return ctrl.access({ domain_msg })
      }
    }

    return new Proxy(
      {},
      {
        get(_target, prop /* , _receiver */) {
          if (path.length > 5) {
            return _thrower(new TypeError(`${path} is not a valid path`))
          }
          if (typeof prop !== 'string') {
            return _thrower(new TypeError(`${String(prop)} not here`))
          }
          return mod_access_proxy([...path, prop])
        },
        apply: _thrower(TypeError('apply not supported')),
        construct: _thrower(TypeError('construct not supported')),
        defineProperty: _thrower(TypeError('defineProperty not supported')),
        deleteProperty: _thrower(TypeError('deleteProperty not supported')),
        getOwnPropertyDescriptor: _thrower(TypeError('getOwnPropertyDescriptor not supported')),
        getPrototypeOf: _thrower(TypeError('getPrototypeOf not supported')),
        has: _thrower(TypeError('has not supported')),
        isExtensible: _thrower(TypeError('isExtensible not supported')),
        ownKeys: _thrower(TypeError('ownKeys not supported')),
        preventExtensions: _thrower(TypeError('preventExtensions not supported')),
        set: _thrower(TypeError('set not supported')),
        setPrototypeOf: _thrower(TypeError('setPrototypeOf not supported')),
      },
    )
  }
}

function _thrower(e: Error) {
  return (...args: _any[]): never => {
    e.message += ` ${JSON.stringify(args)}`
    throw e
  }
}

// export async function preflight<fn extends any_function>(
//   fn: fn,
//   _throws?: errorXxx | ((_: unknown) => errorXxx),
// ): Promise<ReturnType<Awaited<fn>>> {
//   try {
//     const result = await fn()
//     return result
//   } catch (e) {
//     throw new ErrorXxx(typeof _throws === 'function' ? _throws(e) : (_throws ?? errorXxx(500, e)))
//   }
// }
