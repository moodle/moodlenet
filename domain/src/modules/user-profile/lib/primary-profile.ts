import { primaryContext } from '../../../types'
import { validate_currentUserSessionInfo } from '../../user-account/lib'

export async function getMaybeMyProfileRecords({ ctx }: { ctx: primaryContext<any> }) {
  const mySession = await validate_currentUserSessionInfo({ ctx })
  const myProfileRecords = mySession.authenticated ? await ctx.forward.userProfile.authenticated.getMyUserRecords() : null
  return { myProfileRecords }
}
