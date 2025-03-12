import type { myOwn as myOwnType } from './myOwn.endpoint'
export const myOwn: moo.core.endpoint<myOwnType> = async (_, ctx) => {
  return { permissionsInfo: ctx.coreRequest.permissionsInfo }
}
// export const myOwn: moo.core.endpoint<myOwnType> = async (_, { model, over }, ctx) => {
//   const authSessionToken = ctx.coreRequest.gateRequest.info.claims.server.authSessionToken

//   const { info } = await over(model.accessControl.getTokenPermissionsInfo).call.query({ authSessionToken })
//   return {
//     permissions: info.tree,
//   }
// }
