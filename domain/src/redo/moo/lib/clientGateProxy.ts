import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

type messageDispatcher = (message: { path: string[]; payload: unknown }) => Promise<unknown>

export function makeGateProxy({
  session: baseSession,
  gateProvider: baseGateProvider,
  messageDispatcher,
}: {
  session: moo.session.user
  gateProvider: moo.gate.provider<moo.Personas>
  messageDispatcher: messageDispatcher
}) {
  return gateProxy(baseGateProvider, baseSession, []) as unknown as moo.gate.proxy<moo.Personas>
  function gateProxy(gateProvider: any_, session: any_, path: string[]) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (typeof prop !== 'string') {
          throw new TypeError(`GateProxy: Invalid property ${String(prop)}`)
        }

        const _next_gateProvider = gateProvider[prop]
        const _next_session = session[prop]
        const _next_path = [...path, prop]

        if (_next_path.length > 4) {
          throw new TypeError(
            `GateProxy:
  unexistent gate path [${_next_path.join(',')}]
            `,
          )
        }

        if (_next_path.length < 4) {
          if (!_next_session) {
            return undefined
          }

          if (!_next_gateProvider) {
            throw new TypeError(`GateProxy:
                in path [${_next_path.join(',')}]
  _next_sub_session is defined ${_next_session}
  but _next_sub_gateProvider is not ${_next_gateProvider}
              `)
          }

          return gateProxy(_next_gateProvider, _next_session, _next_path)
        }

        // _next_path.length === 4 : endpoint|provider level

        if ('function' !== typeof _next_gateProvider) {
          throw new TypeError(`GateProxy:
  _next_path.length === 4 [${_next_path.join(',')}]
  but _next_sub_gateProvider is not a function ${_next_gateProvider}
            `)
        }
        type p_endpoint = moo.persona.endpoint<moo.persona.endpoint.def>
        const gate_Endpoint_Provider: moo.gate.endpoint<p_endpoint> = _next_gateProvider
        const session_Endpoint: moo.session.endpoint<p_endpoint> = _next_session

        const configs = ((session_Endpoint as any_) ?? {})._

        const e_gate_enpoint = gate_Endpoint_Provider({ configs, session: baseSession })
        if (isLeft(e_gate_enpoint)) {
          return undefined
        }

        const gate_endpoint: moo.gate.endpointAcccess<any_, true> = {
          ...e_gate_enpoint.right,
          call: unsafe_payload => {
            // const { success, data:payload, error } = e_gate_enpoint.right.zod.safeParse(unsafe_payload)
            // if (!success) {
            //   throw new Error4xx('Bad Request', { zod: error })
            // }
            const payload = e_gate_enpoint.right.zod.parse(unsafe_payload)
            return messageDispatcher({ path: _next_path, payload })
          },
        }
        return gate_endpoint
      },
      apply() {
        return { gateProvider, session, path }
      },
    })
  }
}

// const p = makeGateProxy({} as any)
// p.authenticated?.myAccount?.manage?.deleteIt
// p.anonymous?.access?.signup?.withMyEmail?.confirmMyEmail?.more.z({a:32})
// p.anonymous?.access?.signup?.withMyEmail?.submitSignupForm?.more
