import { access_obj, d_u } from '@moodle/lib-types'
import { by_user_id_or_user_home_id, user_home_access_object, userHomePermissions } from '..'
import { sessionLibDep, validate_currentUserSessionInfo } from '../../iam/lib'

// REVIEW : consider put this access logic - as well as `access_obj` - in `iam` (a as access)
// or consider renaming `iam` to `im` or something
export async function accessUserHome({
  ctx,
  by,
}: sessionLibDep & {
  by: by_user_id_or_user_home_id
}): Promise<d_u<{ found: access_obj<user_home_access_object>; notFound: unknown }, 'result'>> {
  const [found, findResult] = await ctx.mod.userHome.query.getUserHome({ by })

  if (!found) {
    return { result: 'notFound' }
  }
  const { userHome } = findResult
  const currentUserSessionInfo = await validate_currentUserSessionInfo({ ctx })
  const { profileInfo, id } = userHome
  const isThisUserHomePublisher = userHome.iamUser.roles.includes('publisher')
  if (!currentUserSessionInfo.authenticated) {
    if (!isThisUserHomePublisher) {
      return { result: 'found', access: 'notAllowed' }
    } else {
      return {
        id,
        result: 'found',
        access: 'allowed',
        profileInfo,
        permissions: _all_user_home_permissions_disallowed,
        user: null,
        flags: { followed: true },
      }
    }
  }

  const itsMe = currentUserSessionInfo.authenticated.user.id === userHome.iamUser.id
  const currentUserIsAdmin = currentUserSessionInfo.authenticated.isAdmin

  if (!(isThisUserHomePublisher || itsMe || currentUserIsAdmin)) {
    return { result: 'found', access: 'notAllowed' }
  }

  return {
    id,
    result: 'found',
    access: 'allowed',
    profileInfo,
    permissions: {
      ...(itsMe
        ? {
            editProfile: true,
            validationConfigs: await getProfileInfoValidationConfigs(),
          }
        : {
            editProfile: false,
          }),
      follow: !itsMe,
      report: !itsMe,
      sendMessage: !itsMe,
      editRoles: !itsMe && currentUserIsAdmin,
    },
    user: itsMe || currentUserIsAdmin ? userHome.iamUser : null,
    flags: { followed: !itsMe },
  }

  async function getProfileInfoValidationConfigs() {
    return (await ctx.mod.env.query.modConfigs({ mod: 'userHome' })).configs.profileInfoPrimaryMsgSchemaConfigs
  }
}

const _all_user_home_permissions_disallowed: userHomePermissions = {
  editRoles: false,
  editProfile: false,
  follow: false,
  report: false,
  sendMessage: false,
}
