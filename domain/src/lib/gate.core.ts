import { any_ } from '@moodle/lib-types'
import assert from 'assert'
import { Either, left, right } from 'fp-ts/Either'
import { ZodType } from 'zod'
import { loggerProvider } from '../types/log'
import { Error4xx } from './access-error'

type gateCore = () => Promise<Either<Error4xx, unknown>>

export type gateCoreDeps = {
  gateProvider: moo.def.gate.provider
  core: moo.def.core
  model: moo.def.model.handle
  request: moo.def.core.request
  loggerProvider: loggerProvider
}
export async function gateCore(deps: gateCoreDeps) {
  type _reducing_branch = Promise<
    | Error4xx
    | {
        policies: moo.def.policies.user.branch<any_>
        gate: moo.def.gate.provider.branch<any_>
        core: moo.def.core.branch<any_>
        path: string[]
      }
  >

  const error4xx_or_reduced_branch = await deps.request.gateRequest.path
    .reduce<_reducing_branch>(
      async (prev_branch_p, prop): _reducing_branch => {
        const prevBranch = await prev_branch_p
        if (prevBranch instanceof Error4xx) {
          return prevBranch
        }
        const currPath = [...(prevBranch?.path ?? []), prop]

        const coreBranch = prevBranch?.core?.[prop as keyof typeof prevBranch.core] as any_ as moo.def.core.node<any_>
        if (!coreBranch) {
          return new Error4xx('Not Implemented', `GateCore: core does not implement path [${currPath.join('.')}]`)
        }

        const currPolicies = (prevBranch?.policies as any_)?.[prop]
        if (!currPolicies) {
          return new Error4xx('Unauthorized', `GateCore: path [${currPath.join('.')}]`)
        }

        const gateBranch = (prevBranch?.gate as any_)?.[prop] as moo.def.gate.provider.node<any_>
        if (!gateBranch) {
          return new Error4xx('Not Implemented', `GateCore: gate does not implement path [${currPath.join('.')}]`)
        }

        const configs = currPolicies._
        const log = deps.loggerProvider({ for: 'core', request: deps.request, branchPath: currPath })
        const env: moo.def.core.env<any_> = {
          configs,
          model: deps.model,
          log,
          request: deps.request,
        }
        const error_or_currCore = await coreBranch(env).catch((error: any_) => (error instanceof Error4xx ? error : new Error4xx('Internal Server Error', String(error))))

        if (error_or_currCore instanceof Error4xx) {
          return error_or_currCore
        }
        const currCore = error_or_currCore

        const context = currCore._
        // log.debug({ configs, context })
        const error_or_currGate = gateBranch(configs, context)

        if (error_or_currGate instanceof Error4xx) {
          return error_or_currGate
        }
        const currGate = error_or_currGate

        return {
          policies: currPolicies,
          core: currCore,
          gate: currGate,
          path: currPath,
        }
      },
      Promise.resolve({
        gate: deps.gateProvider,
        core: deps.core,
        policies: deps.request.userPoliciesInfo.tree,
        path: [],
      }),
    )
    .catch((error: any_) => (error instanceof Error4xx ? error : new Error4xx('Internal Server Error', String(error))))
    .then(error4xx_or_reduced_branch => {
      if (error4xx_or_reduced_branch instanceof Error4xx) return error4xx_or_reduced_branch
      assert(typeof error4xx_or_reduced_branch.core.$ === 'function', `GateCore: core does not implement path [${error4xx_or_reduced_branch.path.join('.')}].$`)
      return error4xx_or_reduced_branch
    })

  if (error4xx_or_reduced_branch instanceof Error4xx) {
    return left(error4xx_or_reduced_branch)
  }
  const reduced_branch = error4xx_or_reduced_branch

  const zod = reduced_branch.gate.zod as ZodType

  assert(typeof zod.safeParse === 'function', `GateCore: no zod found in gate.endpoint path [${reduced_branch.path.join('.')}]K[${Object.keys(reduced_branch.gate).join('.')}]`)

  const { data: form, error, success } = zod.safeParse(deps.request.gateRequest.form)
  if (!success) {
    return left(
      new Error4xx('Bad Request', {
        message: error.message,
        zod: error.format(),
      }),
    )
  }

  const coreFn = reduced_branch.core.$ as moo.def.userType.endpointFunction<any_>
  const e_result = await coreFn(form)
    .then(result => right(result))
    .catch(error => left(error))

  return e_result
}

// type gateCoreProxyDeps = {
//   gateProvider: moo.def.gate.provider
//   core: moo.def.core
//   model: moo.def.model.handle
//   coreRequest: moo.def.core.request
//   loggerProvider: loggerProvider
// }

// type gateStep = Either<
//   Error4xx,
//   {
//     gateProvider: unknown
//     core: unknown
//     session: unknown
//     path: string[]
//   }
// >
// function gateCoreProxy({ model, coreRequest, gateProvider, core, loggerProvider }: gateCoreProxyDeps) {
//   type p_endpoint = moo.def.userType.endpoint

//   return subGateCoreProxy(right({ gateProvider, session: coreRequest.userPoliciesInfo.tree, core, path: [] })) as gateCore

//   function subGateCoreProxy(gateStep: gateStep) {
//     return new Proxy((() => null as any_) as gateCore, {
//       ...unsupportedProxyHandler,
//       get(_target, prop) {
//         const next_gate_step = pipe(
//           gateStep,
//           map(({ gateProvider, path, session, core }) => ({
//             path: [...path, prop],
//             gateProvider: (gateProvider as any_)[prop],
//             session: (session as any_)[prop],
//             core: (core as any_)[prop],
//           })),
//           filter(
//             (_nextGateStep): _nextGateStep is { core: unknown; gateProvider: unknown; session: unknown; path: string[] } => typeof prop === 'string',
//             () => new Error4xx('Not Acceptable', `GateCore: Invalid property ${String(prop)}`),
//           ),
//           filter(
//             nextGateStep => nextGateStep.path.length < 6,
//             ({ path }) =>
//               new Error4xx(
//                 'Bad Request',
//                 `GateCore:
//   overflow gate path [${path.join('.')}]`,
//               ),
//           ),
//           filter(
//             (
//               nextGateStep,
//             ): nextGateStep is {
//               path: string[]
//               gateProvider: NonNullable<unknown>
//               core: unknown
//               session: unknown
//             } => !!nextGateStep.gateProvider,
//             ({ path }) =>
//               new Error4xx(
//                 'Not Found',
//                 `GateCoreProxy:
//   unexistent gate path [${path.join('.')}]`,
//               ),
//           ),
//           filter(
//             (
//               nextGateStep,
//             ): nextGateStep is {
//               path: string[]
//               gateProvider: NonNullable<unknown>
//               core: NonNullable<unknown>
//               session: unknown
//             } => !!nextGateStep.core,
//             ({ path }) =>
//               new Error4xx(
//                 'Not Implemented',
//                 `GateCore:
//   core does not implement path [${path.join('.')}]`,
//               ),
//           ),
//           filter(
//             (
//               nextGateStep,
//             ): nextGateStep is {
//               path: string[]
//               gateProvider: NonNullable<unknown>
//               core: NonNullable<unknown>
//               session: NonNullable<unknown>
//             } => !!nextGateStep.session,
//             ({ path }) => new Error4xx('Forbidden', `path [${path.join('.')}]`),
//           ),
//         )
//         return subGateCoreProxy(next_gate_step)
//       },
//       async apply() {
//         if (isLeft(gateStep)) {
//           return gateStep
//         }

//         if (gateStep.right.path.length !== 5) {
//           return left(
//             new Error4xx(
//               'Bad Request',
//               `GateCore Apply:
//   gate path [${gateStep.right.path.join('.')}]`,
//             ),
//           )
//         }

//         if (!('function' === typeof gateStep.right.gateProvider && 'function' === typeof gateStep.right.core)) {
//           return left(
//             new Error4xx(
//               'Expectation Failed',
//               `GateCore Apply:
//   gateProvider:[${gateStep.right.gateProvider}] & core:[${gateStep.right.core}] are not functions
//   path [${gateStep.right.path.join('.')}]`,
//             ),
//           )
//         }

//         const gate_Endpoint_Provider: moo.def.gate.provider.endpoint<p_endpoint> = gateStep.right.gateProvider as any_
//         const core_Endpoint: moo.def.core.endpoint<p_endpoint> = gateStep.right.core as any_
//         const session_Endpoint: moo.def.policies.user.endpoint<p_endpoint> = gateStep.right.session as any_

//         const configs = session_Endpoint._

//         const e_gate_enpoint = gate_Endpoint_Provider({
//           endpointConfigs: configs,
//           policiesInfo: coreRequest.userPoliciesInfo,
//         })

//         if (isLeft(e_gate_enpoint)) {
//           return e_gate_enpoint
//         }

//         const gateEndpointAccessHandle = e_gate_enpoint.right

//         const { success, data: safe_form, error: form_error } = gateEndpointAccessHandle.zod.safeParse(coreRequest.gate.form)
//         if (!success) {
//           return left(
//             new Error4xx('Bad Request', {
//               message: form_error.message,
//               zod: form_error.format(),
//             }),
//           )
//         }

//         const safeFormCoreRequest: moo.def.core.request = {
//           ...coreRequest,
//           gate: {
//             ...coreRequest.gate,
//             form: safe_form,
//           },
//         }

//         const log = loggerProvider({ for: 'core', request: safeFormCoreRequest })
//         const ctx: moo.def.core.endpointCtx<any_> = {
//           model,
//           coreRequest: safeFormCoreRequest,
//           endpointConfigs: configs,
//           log,
//           zod: gateEndpointAccessHandle.zod,
//           assertCheckEndpointContext:
//             gateEndpointAccessHandle.context &&
//             (context => {
//               const checkError = gateEndpointAccessHandle.context.check({ context })
//               if (checkError) {
//                 throw checkError
//               }
//               const preflightError = gateEndpointAccessHandle.context.preflight({ context, form: safe_form })
//               if (preflightError) {
//                 throw preflightError
//               }
//             }),
//         }
//         const endpointArgs: moo.def.core.endpointArgs<any_> = [safe_form, ctx]

//         const cleanCoreResult: Promise<Either<Error4xx, unknown>> = core_Endpoint(...endpointArgs)
//           .then(result => right(result))
//           .catch(error => {
//             if (isError4xx(error)) {
//               return left(error)
//             }
//             throw error
//           })
//         return cleanCoreResult
//       },
//     })
//   }
// }
