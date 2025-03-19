import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'
import { Error4xx } from './access-error'

export function gateClient({
  policiesInfo,
  gateProvider: baseGateProvider,
  gateClientDispatcher,
}: {
  policiesInfo: moo.def.policies.user.info
  gateProvider: moo.def.gate.provider
  gateClientDispatcher: moo.def.gate.client.dispatcher
}) {
  return subGateClient({
    gateProvider: baseGateProvider,
    policyBranch: policiesInfo,
    path: [],
    accessError: undefined,
  }) as unknown as moo.def.gate.client
  function subGateClient({ policyBranch, path, gateProvider, accessError }: { gateProvider: any_; policyBranch: any_; path: string[]; accessError: Error4xx | undefined }) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (typeof prop !== 'string') {
          throw new TypeError(`gate.client: Invalid property ${String(prop)}`)
        }
        if (prop === '_') {
          return accessError
        }
        if (accessError) {
          return subGateClient({ gateProvider, policyBranch, path, accessError })
        }
        const _next_gateProvider = gateProvider[prop]
        const _next_policyBranch = policyBranch[prop]
        const _next_path = [...path, prop]

        if (_next_path.length > 4) {
          throw new TypeError(
            `gate.client:
  unexistent gate path [${_next_path.join(',')}]
            `,
          )
        }

        if (_next_path.length < 4) {
          if (!_next_policyBranch) {
            return subGateClient({ gateProvider, policyBranch, path, accessError: new Error4xx('Unauthorized') })
          }

          if (!_next_gateProvider) {
            throw new TypeError(`gate.client:
                in path [${_next_path.join(',')}]
  _next_policyBranch is defined ${_next_policyBranch}
  but _next_gateProvider is not ${_next_gateProvider}
              `)
          }

          return subGateClient({
            gateProvider: _next_gateProvider,
            policyBranch: _next_policyBranch,
            path: _next_path,
            accessError,
          })
        }

        // _next_path.length === 4 : endpoint|provider level

        if ('function' !== typeof _next_gateProvider) {
          throw new TypeError(`gate.client:
  _next_path.length === 4 [${_next_path.join(',')}]
  but _next_sub_gateProvider is not a function ${_next_gateProvider}
            `)
        }
        const endpointProvider: moo.def.gate.provider.endpoint = _next_gateProvider
        const session_endpoint: moo.def.policies.config.endpoint = _next_policyBranch

        const configs = (session_endpoint ?? {})._
        const endpointAccess: moo.def.gate.client.endpointAccess = context => {
          const e_gate_endpoint = endpointProvider({ configs, policiesInfo })
          if (isLeft(e_gate_endpoint)) {
            return {
              allowed: false,
              _: { error: e_gate_endpoint.left },
            }
          }
          const endpointAccessHandle: moo.def.gate.client.endpointAccessHandle = {
            _: undefined,
            allowed: true,
            zod: e_gate_endpoint.right.zod,
            context: e_gate_endpoint.right.context,
            send: unsafe_form => {
              // const form = e_gate_endpoint.right.zod.parse(unsafe_form)
              const { success, data: form, error } = e_gate_endpoint.right.zod.safeParse(unsafe_form)
              if (!success) {
                throw new Error4xx('Bad Request', { message: error.message, zod: error.format() })
              }
              if (e_gate_endpoint.right.context) {
                const e_contextCheckResult = e_gate_endpoint.right.context.check({ context })
                if (isLeft(e_contextCheckResult)) {
                  throw e_contextCheckResult.left
                }
                const e_preflightResult = e_gate_endpoint.right.context.preflight({ context, form })
                if (isLeft(e_preflightResult)) {
                  throw e_preflightResult.left
                }
              }
              return gateClientDispatcher({ path: _next_path, form })
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

// const p = gate.clientClient({} as any)
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
