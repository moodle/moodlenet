import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { Either, filter, isLeft, left, map, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { loggerProvider } from '../types/log'
import { Error4xx, isError4xx } from './access-error'

type gateCore = () => Promise<Either<Error4xx, unknown>>

export type gateCoreDeps = {
  gateProvider: moo.def.gate.provider
  core: moo.def.core
  model: moo.def.model.handle
  coreRequest: moo.def.core.request
  loggerProvider: loggerProvider
}
export async function gateCore({ coreRequest, model, core, gateProvider, loggerProvider }: gateCoreDeps) {
  const gateProxy = gateCoreProxy({ gateProvider, core, coreRequest, model, loggerProvider })
  const gatedResult = await coreRequest.gateRequest.path.reduce((curr, prop) => (curr as any_)?.[prop], gateProxy as gateCore)()
  // if (isRight(gatedResult)) {
  //   const cleanCoreResult: Promise<Either<Error4xx, unknown>> = gatedResult.right
  //     .then(result => right(result))
  //     .catch(error => {
  //       if (error instanceof Error4xx) {c
  //         return left(error)
  //       }
  //       throw error
  //     })
  //   return cleanCoreResult
  // }
  return gatedResult
}

type gateCoreProxyDeps = {
  gateProvider: moo.def.gate.provider
  core: moo.def.core
  model: moo.def.model.handle
  coreRequest: moo.def.core.request
  loggerProvider: loggerProvider
}

type gateStep = Either<
  Error4xx,
  {
    gateProvider: unknown
    core: unknown
    session: unknown
    path: string[]
  }
>
function gateCoreProxy({ model, coreRequest, gateProvider, core, loggerProvider }: gateCoreProxyDeps) {
  type p_endpoint = moo.def.userType.endpoint

  return subGateCoreProxy(right({ gateProvider, session: coreRequest.userPoliciesInfo.tree, core, path: [] })) as gateCore

  function subGateCoreProxy(gateStep: gateStep) {
    return new Proxy((() => null as any_) as gateCore, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        const next_gate_step = pipe(
          gateStep,
          map(({ gateProvider, path, session, core }) => ({
            path: [...path, prop],
            gateProvider: (gateProvider as any_)[prop],
            session: (session as any_)[prop],
            core: (core as any_)[prop],
          })),
          filter(
            (_nextGateStep): _nextGateStep is { core: unknown; gateProvider: unknown; session: unknown; path: string[] } => typeof prop === 'string',
            () => new Error4xx('Not Acceptable', `GateCore: Invalid property ${String(prop)}`),
          ),
          filter(
            nextGateStep => nextGateStep.path.length < 6,
            ({ path }) =>
              new Error4xx(
                'Bad Request',
                `GateCore:
  overflow gate path [${path.join('.')}]`,
              ),
          ),
          filter(
            (
              nextGateStep,
            ): nextGateStep is {
              path: string[]
              gateProvider: NonNullable<unknown>
              core: unknown
              session: unknown
            } => !!nextGateStep.gateProvider,
            ({ path }) =>
              new Error4xx(
                'Not Found',
                `GateCoreProxy:
  unexistent gate path [${path.join('.')}]`,
              ),
          ),
          filter(
            (
              nextGateStep,
            ): nextGateStep is {
              path: string[]
              gateProvider: NonNullable<unknown>
              core: NonNullable<unknown>
              session: unknown
            } => !!nextGateStep.core,
            ({ path }) =>
              new Error4xx(
                'Not Implemented',
                `GateCore:
  core does not implement path [${path.join('.')}]`,
              ),
          ),
          filter(
            (
              nextGateStep,
            ): nextGateStep is {
              path: string[]
              gateProvider: NonNullable<unknown>
              core: NonNullable<unknown>
              session: NonNullable<unknown>
            } => !!nextGateStep.session,
            ({ path }) => new Error4xx('Forbidden', `path [${path.join('.')}]`),
          ),
        )
        return subGateCoreProxy(next_gate_step)
      },
      async apply() {
        if (isLeft(gateStep)) {
          return gateStep
        }

        if (gateStep.right.path.length !== 5) {
          return left(
            new Error4xx(
              'Bad Request',
              `GateCore Apply:
  gate path [${gateStep.right.path.join('.')}]`,
            ),
          )
        }

        if (!('function' === typeof gateStep.right.gateProvider && 'function' === typeof gateStep.right.core)) {
          return left(
            new Error4xx(
              'Expectation Failed',
              `GateCore Apply:
  gateProvider:[${gateStep.right.gateProvider}] & core:[${gateStep.right.core}] are not functions
  path [${gateStep.right.path.join('.')}]`,
            ),
          )
        }

        const gate_Endpoint_Provider: moo.def.gate.provider.endpoint<p_endpoint> = gateStep.right.gateProvider as any_
        const core_Endpoint: moo.def.core.endpoint<p_endpoint> = gateStep.right.core as any_
        const session_Endpoint: moo.def.policies.user.endpoint<p_endpoint> = gateStep.right.session as any_

        const configs = session_Endpoint._

        const e_gate_enpoint = gate_Endpoint_Provider({
          endpointConfigs: configs,
          policiesInfo: coreRequest.userPoliciesInfo,
        })

        if (isLeft(e_gate_enpoint)) {
          return e_gate_enpoint
        }

        const gateEndpointAccessHandle = e_gate_enpoint.right

        const { success, data: safe_form, error: form_error } = gateEndpointAccessHandle.zod.safeParse(coreRequest.gateRequest.form)
        if (!success) {
          return left(
            new Error4xx('Bad Request', {
              message: form_error.message,
              zod: form_error.format(),
            }),
          )
        }

        const safeFormCoreRequest: moo.def.core.request = {
          ...coreRequest,
          gateRequest: {
            ...coreRequest.gateRequest,
            form: safe_form,
          },
        }

        const log = loggerProvider({ for: 'core', request: safeFormCoreRequest })
        const ctx: moo.def.core.endpointCtx<any_> = {
          model,
          coreRequest: safeFormCoreRequest,
          endpointConfigs: configs,
          log,
          zod: gateEndpointAccessHandle.zod,
          assertCheckEndpointContext:
            gateEndpointAccessHandle.context &&
            (context => {
              const checkError = gateEndpointAccessHandle.context.check({ context })
              if (checkError) {
                throw checkError
              }
              const preflightError = gateEndpointAccessHandle.context.preflight({ context, form: safe_form })
              if (preflightError) {
                throw preflightError
              }
            }),
        }
        const endpointArgs: moo.def.core.endpointArgs<any_> = [safe_form, ctx]

        const cleanCoreResult: Promise<Either<Error4xx, unknown>> = core_Endpoint(...endpointArgs)
          .then(result => right(result))
          .catch(error => {
            if (isError4xx(error)) {
              return left(error)
            }
            throw error
          })
        return cleanCoreResult
      },
    })
  }
}
