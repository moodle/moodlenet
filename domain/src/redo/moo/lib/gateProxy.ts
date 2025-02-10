import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'
import { Error4xx } from '../../../types'

const INSPECT_SYM = Symbol('GateProxy inspect symbol')

export function makeGateProxy({
  session,
  messageDispatcher,
  gateProvider,
}: {
  session: moo.session.user
  gateProvider: moo.gate.provider
  messageDispatcher: moo.gate.messageDispatcher
}) {
  return gateProxy(gateProvider, session, []) as unknown as moo.gate.user
  function gateProxy(_sub_gateProvider: any_, _sub_session: any_, path: string[]) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (prop === INSPECT_SYM) {
          return path
        }

        if (typeof prop !== 'string') {
          throw new TypeError(`GateProxy: Invalid property ${String(prop)}`)
        }

        const _next_sub_gateProvider = _sub_gateProvider[prop]
        const _next_sub_session = _sub_session[prop]
        const _next_path = [...path, prop]

        if (_next_path.length > 4) {
          throw new Error4xx(
            'Not Found',
            `
            GateProxy:
              unexistent gate path [${_next_path.join(',')}]
            `,
          )
        }

        if (_next_path.length < 4) {
          if (!_next_sub_session) {
            return undefined
          }

          if (!_next_sub_gateProvider) {
            throw new TypeError(`
              GateProxy:
                in path [${_next_path.join(',')}]
                _next_sub_session is defined ${_next_sub_session}
                but _next_sub_gateProvider is not ${_next_sub_gateProvider}
              `)
          }

          return gateProxy(_next_sub_gateProvider, _next_sub_session, _next_path)
        }

        // _next_path.length === 4 : endpoint|provider level

        if ('function' !== typeof _next_sub_gateProvider) {
          throw new TypeError(`
            GateProxy:
              _next_path.length === 4 [${_next_path.join(',')}]
              but _next_sub_gateProvider is not a function ${_next_sub_gateProvider}
            `)
        }

        const gate_Endpoint_Provider: moo.gate.endpointProvider<moo.persona.endpoint> = _next_sub_gateProvider
        const session_Endpoint: moo.session.Endpoint<moo.persona.endpoint> = _next_sub_session

        const configs = ((session_Endpoint as any_) ?? {})._

        const e_gate_enpoint = gate_Endpoint_Provider({ configs, session })
        if (isLeft(e_gate_enpoint)) {
          return undefined
        }
        const gate_endpoint: moo.gate.endpoint<any_, false> = {
          ...e_gate_enpoint.right,
          call: payload => messageDispatcher({ path: _next_path, payload }),
        }
        return gate_endpoint
      },
      apply(_target, _thisArg, [payload]) {
        return messageDispatcher({ path, payload })
      },
    })
  }
}
