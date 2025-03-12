import { unsupportedProxyHandler } from '@moodle/lib-types'

export function gateProxy({
  formDispatcher,
  requestInfo,
}: {
  requestInfo: moo.gate.provider.requestInfo
  formDispatcher: moo.gate.provider.dispatcher
}): moo.gate.proxy<moo.Personas> {
  return subGateProxy({
    path: [],
  }) as unknown as moo.gate.proxy<moo.Personas>
  function subGateProxy({ path }: { path: string[] }) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (typeof prop !== 'string') {
          throw new TypeError(`gate.proxy: Invalid property ${String(prop)}`)
        }

        const _next_path = [...path, prop]

        if (_next_path.length > 4) {
          throw new TypeError(
            `gate.proxy:
  unexistent gate path [${_next_path.join(',')}]
            `,
          )
        }

        if (_next_path.length < 4) {
          return subGateProxy({
            path: _next_path,
          })
        }

        // _next_path.length === 4 : endpoint|provider level

        const gateProxyEndpointCall: moo.gate.proxy.endpoint = form => {
          return formDispatcher({ form, path, info: requestInfo })
        }

        return gateProxyEndpointCall
      },
    })
  }
}

// declare const _: moo.gate.proxy<moo.Personas>
// const x = _.anonymous.access.login.withMyEmailAndPassword.login({form:{password,email},info:{claims:{server:{}}},})
