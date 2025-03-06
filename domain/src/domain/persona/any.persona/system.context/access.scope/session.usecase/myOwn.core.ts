import type { myOwn as myOwnType } from './myOwn.endpoint'
export const myOwn: moo.core.endpoint<myOwnType> = async (_, { model, over }, ctx) => {
  const authSessionToken = ctx.coreRequest.gateRequest.info.claims.server.authSessionToken

  ctx.log.debug(`myOwn ctx.coreRequest.gateRequest.info.claims.server.authSessionToken: ${authSessionToken}`)
  const { info } = await over(model.accessControl.getTokenPermissionsInfo).call.query({ authSessionToken })
  ctx.log.debug(`myOwn info: `, info)
  return {
    permissions: info.tree,
  }
}
