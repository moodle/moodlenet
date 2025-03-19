import type { myOwn as myOwnType } from './myOwn.endpoint'
export const myOwn: moo.def.core.endpoint<myOwnType> = async (_, ctx) => {
  return { policiesInfo: ctx.coreRequest.policiesInfo }
}
// export const myOwn: moo.def.core.endpoint<myOwnType> = async (_, { model, over }, ctx) => {
//   const authSessionToken = ctx.coreRequest.gateRequest.info.claims.server.authSessionToken

//   const { info } = await over(model.accessControl.getTokenPoliciesInfo).call.query({ authSessionToken })
//   return {
//     policies: info.tree,
//   }
// }
