import { _any, deep_partial } from '@moodle/lib/types'
import { Modules, MoodleDomain } from '../domain'

export const _inspect_symbol = Symbol('moduleAccessProxy inspect')
export type domain_msg = {
  //domain_version:string
  ns: string
  mod: string
  layer: string
  version: string
  channel: string
  port: string
  payload: _any
}

export function dispatch(
  domain: deep_partial<MoodleDomain>,
  { ns, mod, version, layer, channel, port, payload }: domain_msg,
  handleError: (found: unknown) => void,
) {
  const access = (domain as _any).modules?.[ns]?.[mod]?.[version]?.[layer]?.[channel]?.[port]

  if (typeof access !== 'function') {
    handleError(access)
    return
  }
  return access(payload)
}

//
//
//
//
//

type domain_access = (_: domain_msg) => unknown

//export type listener<ev extends event_layer>=()=>unknown
export interface AccessProxy {
  mod: Modules
}
export interface DomainProxyCtrl {
  access: domain_access
}
type s = string
function isFullLength(path: string[]): path is [s, s, s, s, s, s] {
  return path.length == 6
}
export function createAcccessProxy(ctrl: DomainProxyCtrl): AccessProxy {
  const mod = mod_access_proxy([])
  return { mod }

  function mod_access_proxy(path: string[]) {
    if (isFullLength(path)) {
      return function call(payload: _any) {
        const domain_msg: domain_msg = {
          ns: path[0],
          mod: path[1],
          version: path[2],
          layer: path[3],
          channel: path[4],
          port: path[5],
          payload,
        }
        if (payload === _inspect_symbol) {
          return domain_msg
        }

        return ctrl.access(domain_msg)
      }
    }

    return new Proxy(
      {},
      {
        get(_target, prop /* , _receiver */) {
          if (path.length > 5) {
            return _throw(new TypeError(`${path} is not a valid path`))
          }
          if (typeof prop !== 'string') {
            return _throw(new TypeError(`${String(prop)} not here`))
          }
          return mod_access_proxy([...path, prop])
        },
        // apply(_target, _thisArg, args) {
        //   if (path.length != 6) {
        //     return _throw(new TypeError(`${path} is not a valid message endpoint`))
        //   }
        //   const payload = args[0]

        //   const domain_msg: domain_msg = {
        //     ns: path[0],
        //     mod: path[1],
        //     version: path[2],
        //     layer: path[3],
        //     channel: path[4],
        //     port: path[5],
        //     payload,
        //   }
        //   if (payload === _inspect_symbol) {
        //     return domain_msg
        //   }

        //   return ctrl.access(domain_msg)
        // },
        apply: _throw(TypeError('apply not supported')),
        construct: _throw(TypeError('construct not supported')),
        defineProperty: _throw(TypeError('defineProperty not supported')),
        deleteProperty: _throw(TypeError('deleteProperty not supported')),
        getOwnPropertyDescriptor: _throw(TypeError('getOwnPropertyDescriptor not supported')),
        getPrototypeOf: _throw(TypeError('getPrototypeOf not supported')),
        has: _throw(TypeError('has not supported')),
        isExtensible: _throw(TypeError('isExtensible not supported')),
        ownKeys: _throw(TypeError('ownKeys not supported')),
        preventExtensions: _throw(TypeError('preventExtensions not supported')),
        set: _throw(TypeError('set not supported')),
        setPrototypeOf: _throw(TypeError('setPrototypeOf not supported')),
      },
    )
  }
}

function _throw(e: Error) {
  return (...args: any[]): never => {
    e.message += ` ${JSON.stringify(args)}`
    throw e
  }
}
