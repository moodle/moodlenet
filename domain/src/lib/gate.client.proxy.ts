import { unsupportedProxyHandler } from '@moodle/lib-types'
import assert from 'assert'

export function gateClientProxy({ gateClientDispatcher }: { gateClientDispatcher: moo.gate.client.dispatcher }): moo.gate.client.proxy {
  return subGateProxy({
    path: [],
  }) as unknown as moo.gate.client.proxy
  function subGateProxy({ path }: { path: string[] }) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        assert(typeof prop === 'string', new TypeError(`gate.client.proxy: Invalid property ${String(prop)}`))

        const _next_path = [...path, prop]
        assert(
          _next_path.length <= 4,
          new TypeError(
            `gate.client.proxy:
  unexistent gate path [${_next_path.join(',')}]
            `,
          ),
        )

        if (_next_path.length < 4) {
          return subGateProxy({
            path: _next_path,
          })
        }

        // _next_path.length === 4 : endpoint|provider level

        const gateProxyEndpointCall: moo.gate.client.proxy.endpoint = form => {
          return gateClientDispatcher({ form, path })
        }

        return gateProxyEndpointCall
      },
    })
  }
}

// declare const _: moo.gate.client.proxy<moo.Personas>
// const x = _.anonymous.access.login.withMyEmailAndPassword.login({form:{password,email},info:{claims:{server:{}}},})
