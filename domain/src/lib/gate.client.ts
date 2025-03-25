import { any_, map, unsupportedProxyHandler } from '@moodle/lib-types'
import { Error4xx } from './access-error'

export function gateClient({
  policiesInfo,
  gateProvider,
  gateClientDispatcher,
}: {
  policiesInfo: moo.def.policies.user.info
  gateProvider: moo.def.gate.provider
  gateClientDispatcher: moo.def.gate.client.dispatcher
}): moo.def.gate.client {
  const gateClient = branch({ branchGate: gateProvider as any_, branchPolicies: policiesInfo.tree, gateClientDispatcher }) as unknown as moo.def.gate.client
  // console.log('gate - Client', { gateClient /* , __: Object.entries(gateClient)  */ })
  return gateClient
}

function branch({
  branchGate,
  branchPolicies,
  gateClientDispatcher,
  path = [],
}: {
  branchGate: map<moo.def.gate.provider.node<any_>>
  branchPolicies: any_
  gateClientDispatcher: moo.def.gate.client.dispatcher
  path?: string[]
}): moo.def.gate.client.branch<any_> | moo.def.gate.client.endpointAccessHandle {
  return isEndpointChecksHandle(branchGate)
    ? ({
        // preflight: branchGate.preflight,
        zod: branchGate.zod,
        send: async _form => {
          const { success, data: form, error } = branchGate.zod.safeParse(_form)
          if (!success) {
            throw new Error4xx('Bad Request', { zod: error.format(), message: error.message })
          }
          return gateClientDispatcher({ form, path })
        },
      } satisfies moo.def.gate.client.endpointAccessHandle)
    : Object.entries(branchGate).reduce((client, [branchName, subBranchProvider]) => {
        const subBranchPolicies = branchPolicies[branchName]
        // console.log({ subBranchPolicies, branchName, branchPolicies, branchGate })

        if (!subBranchPolicies) {
          client[branchName] = errorProxy(new Error4xx('Unauthorized', { message: `path [${path.join('.')}]` }))
          return client
        }

        const subBranch: moo.def.gate.client.node<any_> = (subBranchContext: unknown) => {
          // console.log('subBranch', { subBranchContext })
          const subBranchConfigs = subBranchPolicies._
          const error4xx_or_subBranchGate = subBranchProvider(subBranchConfigs, subBranchContext)

          if (error4xx_or_subBranchGate instanceof Error4xx) {
            return errorProxy(error4xx_or_subBranchGate)
          }
          const subBranchGate = error4xx_or_subBranchGate

          return branch({ branchPolicies: subBranchPolicies, branchGate: subBranchGate, gateClientDispatcher, path: [...path, branchName] })
        }

        client[branchName] = subBranch
        return client
      }, {} as moo.def.gate.client.branch<any_>)
}
function errorProxy(error4xx: Error4xx) {
  const p = new Proxy(
    function errorProxy() {
      /* */
    },
    {
      ...unsupportedProxyHandler(),
      apply() {
        return errorProxy(error4xx)
      },
      get(_target, prop) {
        if (prop === '$error') return error4xx
        return errorProxy(error4xx)
      },
    },
  ) as any_
  return p
}
function isEndpointChecksHandle(endpointAccessHandle: any_): endpointAccessHandle is moo.def.gate.endpointChecksHandle {
  return !!endpointAccessHandle && 'zod' in endpointAccessHandle
}

// declare const _: moo.def.gate.client
// // ;async () => {
// //   const x = await pipe(
// //     _.any(),
// //     bind('cfgUany', ({ _ }) => right(_)),
// //     bind('ac', ({ accessControl }) => accessControl(some({ m1: '' }))),
// //     bind('cfgMac', ({ ac: { _ } }) => right(_)),
// //     bind('pol', ({ ac }) => ac.policies()),
// //     bind('re', ({ pol }) => pol.readMyOwn()),
// //     bind('pi', ({ re }) => re.policiesInfo()),
// //     bind('aa', ({ pi }) => right(pi.send().then(_ => _.policiesInfo))),
// //     E.getOrElse(() => null),
// //   )
// // }

// const __ = _.any()?.accessControl()?.policies()?.readMyOwn()?.policiesInfo()
// __?.send().then(_ => _.policiesInfo)

// const _X_ = _.any?.().accessControl?.().policies?.().readMyOwn?.().policiesInfo?.()
// const _Y_ = _X_?.send?.().then(_ => _.policiesInfo)
// const _Z_ = _.any
// !_Z_ && _Z_.$error

// const _Q_ = _.any().accessControl().policies().readMyOwn()
// const _W_ = _Q_.policiesInfo()
// _W_.$error && _W_.send().then(_ => _.policiesInfo)
// !_W_.$error && _W_.send().then(_ => _.policiesInfo)
// !_W_.$error && _W_.send
// _W_.$error && _W_.send
// !_W_.send && _W_.$error
// _W_.send && _W_.$error
// _W_.$error
// _Q_.$error
