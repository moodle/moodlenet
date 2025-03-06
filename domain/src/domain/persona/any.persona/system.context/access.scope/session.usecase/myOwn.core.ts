import type { myOwn as myOwnType } from './myOwn.endpoint'
export const myOwn: moo.core.endpoint<myOwnType> = async (_, __, ctx) => {
  return { permissions: ctx.coreRequest.permissionsInfo.tree }
}
// export const myOwn: moo.core.endpoint<myOwnType> = async (_, { model, over }, ctx) => {
//   const authSessionToken = ctx.coreRequest.gateRequest.info.claims.server.authSessionToken

//   const { info } = await over(model.accessControl.getTokenPermissionsInfo).call.query({ authSessionToken })
//   return {
//     permissions: info.tree,
//   }
// }
