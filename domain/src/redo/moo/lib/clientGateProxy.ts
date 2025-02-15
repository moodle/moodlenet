import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'
import { Error4xx } from './access-error'

type messageDispatcher = (message: { path: string[]; form: unknown }) => Promise<unknown>

export function clientGateProxy({
  session: baseSession,
  gateProvider: baseGateProvider,
  messageDispatcher,
}: {
  session: moo.session.user
  gateProvider: moo.gate.provider<moo.Personas>
  messageDispatcher: messageDispatcher
}) {
  return subClientGateProxy({
    gateProvider: baseGateProvider,
    session: baseSession,
    path: [],
    accessError: undefined,
  }) as unknown as moo.gate.client<moo.Personas>
  function subClientGateProxy({
    session,
    path,
    gateProvider,
    accessError,
  }: {
    gateProvider: any_
    session: any_
    path: string[]
    accessError: Error4xx | undefined
  }) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (typeof prop !== 'string') {
          throw new TypeError(`GateProxy: Invalid property ${String(prop)}`)
        }
        if (prop === '_') {
          return accessError
        }
        if (accessError) {
          return subClientGateProxy({ gateProvider, session, path, accessError })
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
            return subClientGateProxy({ gateProvider, session, path, accessError: new Error4xx('Unauthorized') })
          }

          if (!_next_gateProvider) {
            throw new TypeError(`GateProxy:
                in path [${_next_path.join(',')}]
  _next_sub_session is defined ${_next_session}
  but _next_sub_gateProvider is not ${_next_gateProvider}
              `)
          }

          return subClientGateProxy({
            gateProvider: _next_gateProvider,
            session: _next_session,
            path: _next_path,
            accessError,
          })
        }

        // _next_path.length === 4 : endpoint|provider level

        if ('function' !== typeof _next_gateProvider) {
          throw new TypeError(`GateProxy:
  _next_path.length === 4 [${_next_path.join(',')}]
  but _next_sub_gateProvider is not a function ${_next_gateProvider}
            `)
        }
        type endpoint_type = moo.persona.endpoint<moo.persona.endpoint.def>
        const endpointProvider: moo.gate.provider.endpoint<endpoint_type> = _next_gateProvider
        const session_endpoint: moo.session.endpoint<endpoint_type> = _next_session

        const configs = (session_endpoint ?? {})._
        const endpointAccess: moo.gate.client.endpointAccess<endpoint_type> = context => {
          const e_gate_endpoint = endpointProvider({ configs, session: baseSession })
          if (isLeft(e_gate_endpoint)) {
            return {
              allowed: false,
              _: { error: e_gate_endpoint.left },
            }
          }
          const endpointAccessHandle: moo.gate.client.endpointAccessHandle<endpoint_type> = {
            _: undefined,
            allowed: true,
            zod: e_gate_endpoint.right.zod,
            context: e_gate_endpoint.right.context,
            send: unsafe_form => {
              // const form = e_gate_endpoint.right.zod.parse(unsafe_form)
              const { success, data: form, error } = e_gate_endpoint.right.zod.safeParse(unsafe_form)
              if (!success) {
                throw new Error4xx('Bad Request', { zod: error })
              }
              if (e_gate_endpoint.right.context) {
                const contextCheckResult = e_gate_endpoint.right.context.check({ context })
                if (contextCheckResult) {
                  throw contextCheckResult
                }
                const preflightResult = e_gate_endpoint.right.context.preflight({ context, form })
                if (preflightResult) {
                  throw preflightResult
                }
              }
              return messageDispatcher({ path: _next_path, form })
            },
          }
          return endpointAccessHandle
        }
        endpointAccess._ = accessError

        return endpointAccess
      },
    })
  }
}

// const p = clientGateProxy({} as any)
// const _ = p.anonymous.access.login.withMyEmailAndPassword.login()
// !_.allowed || _.send({ email: '', password:redacted( '')} })

// const c = p.anonymous.access.signup.withMyEmail.confirmMyEmail({ ctxA: '32' })

// const q = c.zod ? c.send({ signupEmailVerificationToken: '' }) : c()
// const e = p.anonymous.access.signup.withMyEmail.confirmMyEmail()
// e.allowed && e.context.preflight({context:{ctxA:'32'},form:{signupEmailVerificationToken:''}})
// if (e) {
//   const { displayName, email, password } = e.zod.parse({})
//   const x = e.call({ password, email, displayName })
// }
