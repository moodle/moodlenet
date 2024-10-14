import { _void, path } from './data'
import { _any } from './map'

export const _inspect_symbol = Symbol('moduleAccessProxy inspect')
type proxy_applier<arg> = (_: { path: path; arg: arg }) => unknown

type path_proxy_ctrl<arg> = {
  apply: proxy_applier<arg>
}
export function createPathProxy<t, arg = _any>(ctrl: path_proxy_ctrl<arg>): t {
  const pathProxy = path_proxy([]) as t
  return pathProxy

  function path_proxy(path: path) {
    return new Proxy(() => _void, {
      ...unsupportedProxyHandler<() => void>(),
      get(_target, prop /* , _receiver */) {
        if (typeof prop !== 'string') {
          throw new TypeError(`${String(prop)} not here`)
        }
        return path_proxy([...path, prop])
      },
      apply(_target, _thisArg, [arg]) {
        if (arg === _inspect_symbol) {
          return path
        }

        return ctrl.apply({ path, arg })
      },
    })
  }
}

export function unsupportedProxyHandler<T extends object>(): ProxyHandler<T> {
  const usnupportedProxyHandler: ProxyHandler<T> = {
    get: _thrower(TypeError('get not supported')),
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
  }
  return usnupportedProxyHandler
  function _thrower(e: Error) {
    return (...args: _any[]): never => {
      e.message += ` ${JSON.stringify(args)}`
      throw e
    }
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
