import { any_, unsupportedProxyHandler } from '@moodle/lib-types'

export function clientGateReverseProxy({ formDispatcher }: { formDispatcher: moo.gate.client.dispatcher<any_> }): moo.gate.provider<moo.Personas> {
  return subClientGateReverseProxy({
    path: [],
  }) as unknown as moo.gate.provider<moo.Personas>
  function subClientGateReverseProxy({ path }: { path: string[] }) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (typeof prop !== 'string') {
          throw new TypeError(`GateProxy: Invalid property ${String(prop)}`)
        }

        const _next_path = [...path, prop]

        if (_next_path.length > 4) {
          throw new TypeError(
            `ClilentGateReverseProxy:
  unexistent gate path [${_next_path.join(',')}]
            `,
          )
        }

        if (_next_path.length < 4) {
          return subClientGateReverseProxy({
            path: _next_path,
          })
        }

        // _next_path.length === 4 : endpoint|provider level

        type endpoint_type = moo.persona.endpoint<moo.persona.endpoint.def>
        const gateClientDispatcher: moo.gate.client.endpointCall<endpoint_type> = form => {
          return formDispatcher({ form, path })
        }

        return gateClientDispatcher
      },
    })
  }
}

// declare const _: moo.gate.client<moo.Personas>
// false && _.anonymous.access.login.withMyEmailAndPassword.login().send?.({"email":"","password":{"###--redacted--###":""}})
