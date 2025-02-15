import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { Either, filter, isLeft, left, map, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { Error4xx, isError4xx } from './access-error'

type gateStep = Either<
  Error4xx,
  {
    gateProvider: unknown
    session: unknown
    core: unknown
    path: string[]
  }
>
type coreGate = (_: { form: unknown; ctx: moo.core.ctx }) => Promise<Either<Error4xx, unknown>>

type gateCoreDeps = {
  session: moo.session.user
  gateProvider: moo.gate.provider<moo.Personas>
  core: moo.core<moo.Personas>
}

export async function coreGate({
  ctx,
  form,
  coreTargetPath,
  ...gateCoreDeps
}: gateCoreDeps & { coreTargetPath: string[]; ctx: moo.core.ctx; form: unknown }) {
  const gateProxy = coreGateProxy(gateCoreDeps)
  const gatedResult = coreTargetPath.reduce((curr, prop) => (curr as any_)?.[prop], gateProxy)({ ctx, form })
  // if (isRight(gatedResult)) {
  //   const cleanCoreResult: Promise<Either<Error4xx, unknown>> = gatedResult.right
  //     .then(result => right(result))
  //     .catch(error => {
  //       if (error instanceof Error4xx) {
  //         return left(error)
  //       }
  //       throw error
  //     })
  //   return cleanCoreResult
  // }
  return gatedResult
}

export function coreGateProxy({ session, gateProvider, core }: gateCoreDeps) {
  const baseSession = session
  type p_endpoint = moo.persona.endpoint<moo.persona.endpoint.def>

  return subCoreGateProxy(right({ gateProvider, session, core, path: [] })) as coreGate

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
              session: unknown
              core: unknown
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
              session: NonNullable<unknown>
              core: unknown
            } => !!nextGateStep.session,
            ({ path }) => new Error4xx('Forbidden', `path [${path.join('.')}]`),
          ),
          filter(
            (
              nextGateStep,
            ): nextGateStep is {
              path: string[]
              gateProvider: NonNullable<unknown>
              session: NonNullable<unknown>
              core: NonNullable<unknown>
            } => !!nextGateStep.core,
            ({ path }) =>
              new Error4xx(
                'Not Implemented',
                `CoreGate:
  core does not implement path [${path.join('.')}]`,
              ),
          ),
        )
        return subCoreGateProxy(next_gate_step)
      },
      async apply(_target, _thisArg, [{ form: unsafe_form, ctx }]: Parameters<coreGate>): ReturnType<coreGate> {
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
        const session_Endpoint: moo.session.endpoint<p_endpoint> = gateStep.right.session as any_

        const endpointConfigs = session_Endpoint._
        const e_gate_enpoint = gate_Endpoint_Provider({ configs: endpointConfigs, session: baseSession })

        if (isLeft(e_gate_enpoint)) {
          return e_gate_enpoint
        }

        const gateEndpointAccessHandle = e_gate_enpoint.right

        const { success, data: form, error } = gateEndpointAccessHandle.zod.safeParse(unsafe_form)
        if (!success) {
          return left(
            new Error4xx('Bad Request', {
              message: error.message,
              zod: error,
              path: gateStep.right.path,
              configs: endpointConfigs,
            }),
          )
        }

        const cleanCoreResult: Promise<Either<Error4xx, unknown>> = core_Endpoint({
          form,
          ctx,
          configs: endpointConfigs,
          zod: gateEndpointAccessHandle.zod,
          assertContextChecks:
            gateEndpointAccessHandle.context &&
            (context => {
              const checkError = gateEndpointAccessHandle.context.check({ context })
              if (checkError) {
                throw checkError
              }
              const preflightError = gateEndpointAccessHandle.context.preflight({ context, form })
              if (preflightError) {
                throw preflightError
              }
            }),
        })
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
