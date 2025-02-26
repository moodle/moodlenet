import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { Either, filter, isLeft, left, map, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { Error4xx, isError4xx } from './access-error'
import { loggerProvider } from '../types/log'

type coreGate = () => Promise<Either<Error4xx, unknown>>

export type coreGateDeps = {
  gateProvider: moo.gate.provider<any_> //moo.Personas>
  core: moo.core<any_> //moo.Personas>
  modelHandle: moo.model.handle
  coreAccess: moo.core.access<any_>
  loggerProvider: loggerProvider
}
export async function coreGate({ coreAccess, modelHandle, core, gateProvider, loggerProvider }: coreGateDeps) {
  const gateProxy = coreGateProxy({ gateProvider, core, coreAccess, modelHandle, loggerProvider })
  const gatedResult = await coreAccess.gateAccess.path.reduce(
    (curr, prop) => (curr as any_)?.[prop],
    gateProxy as coreGate,
  )()
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

type coreGateProxyDeps = {
  gateProvider: moo.gate.provider<any_> //moo.Personas>
  core: moo.core<any_> //moo.Personas>
  modelHandle: moo.model.handle
  coreAccess: moo.core.access<any_>
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
export function coreGateProxy({ modelHandle, coreAccess, gateProvider, core, loggerProvider }: coreGateProxyDeps) {
  type p_endpoint = moo.persona.endpoint<moo.persona.endpoint.def>

  return subCoreGateProxy(right({ gateProvider, session: coreAccess.sessionInfo.session, core, path: [] })) as coreGate

  function subCoreGateProxy(gateStep: gateStep) {
    return new Proxy((() => null as any_) as coreGate, {
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
            (_nextGateStep): _nextGateStep is { core: unknown; gateProvider: unknown; session: unknown; path: string[] } =>
              typeof prop === 'string',
            () => new Error4xx('Not Acceptable', `CoreGate: Invalid property ${String(prop)}`),
          ),
          filter(
            nextGateStep => nextGateStep.path.length < 6,
            ({ path }) =>
              new Error4xx(
                'Bad Request',
                `CoreGate:
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
                `CoreGate:
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
                `CoreGate:
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
        return subCoreGateProxy(next_gate_step)
      },
      async apply() {
        if (isLeft(gateStep)) {
          return gateStep
        }

        if (gateStep.right.path.length !== 5) {
          return left(
            new Error4xx(
              'Bad Request',
              `CoreGate Apply:
  gate path [${gateStep.right.path.join('.')}]`,
            ),
          )
        }

        if (!('function' === typeof gateStep.right.gateProvider && 'function' === typeof gateStep.right.core)) {
          return left(
            new Error4xx(
              'Expectation Failed',
              `CoreGate Apply:
  gateProvider:[${gateStep.right.gateProvider}] & core:[${gateStep.right.core}] are not functions
  path [${gateStep.right.path.join('.')}]`,
            ),
          )
        }

        const gate_Endpoint_Provider: moo.gate.provider.endpoint<p_endpoint> = gateStep.right.gateProvider as any_
        const core_Endpoint: moo.core.endpoint<p_endpoint> = gateStep.right.core as any_
        const session_Endpoint: moo.session.user.endpoint<p_endpoint> = gateStep.right.session as any_

        const configs = session_Endpoint._

        const e_gate_enpoint = gate_Endpoint_Provider({
          configs,
          sessionInfo: coreAccess.sessionInfo,
        })

        if (isLeft(e_gate_enpoint)) {
          return e_gate_enpoint
        }

        const gateEndpointAccessHandle = e_gate_enpoint.right

        const {
          success,
          data: safe_form,
          error: form_error,
        } = gateEndpointAccessHandle.zod.safeParse(coreAccess.gateAccess.form)
        if (!success) {
          return left(
            new Error4xx('Bad Request', {
              message: form_error.message,
              zod: form_error.format(),
            }),
          )
        }

        const access: moo.core.access<any_> = {
          ...coreAccess,
          gateAccess: {
            ...coreAccess.gateAccess,
            form: safe_form,
          },
        }

        const log = loggerProvider({ for: 'core', access })
        const ctx: moo.core.ctx<any_> = {
          access,
          configs,
          log,
          zod: gateEndpointAccessHandle.zod,
          assertContextChecks:
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
        const endpointArgs: moo.core.endpointArgs<any_> = [safe_form, modelHandle, ctx]

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
