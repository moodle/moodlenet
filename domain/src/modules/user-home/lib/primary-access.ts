import { access_obj, d_u } from '@moodle/lib-types'
import { by_user_id_or_user_home_id, user_home_access_object, user_home_permissions } from '..'
import { sessionLibDep, validate_userSessionInfo } from '../../iam/lib'

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
  const currentUserSessionInfo = await validate_userSessionInfo({ ctx })
  const { profileInfo, id } = userHome
  const isThisUserHomePublisher = userHome.user.roles.includes('publisher')
  if (!currentUserSessionInfo.authenticated) {
    if (!isThisUserHomePublisher) {
      return { result: 'found', access: 'notAllowed' }
    } else {
      return {
        id,
        result: 'found',
        access: 'allowed',
        profileInfo,
        avatar: profileInfo.avatar,
        background: profileInfo.background,
        permissions: _all_user_home_permissions_disallowed,
        user: null,
        flags: { followed: true },
      }
    }
  }

  const itsMe = currentUserSessionInfo.authenticated.user.id === userHome.user.id
  const currentUserIsAdmin = currentUserSessionInfo.authenticated.isAdmin

  if (!(isThisUserHomePublisher || itsMe || currentUserIsAdmin)) {
    return { result: 'found', access: 'notAllowed' }
  }

  return {
    id,
    result: 'found',
    access: 'allowed',
    profileInfo,
    avatar: profileInfo.avatar,
    background: profileInfo.background,
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
    user: itsMe || currentUserIsAdmin ? userHome.user : null,
    flags: { followed: !itsMe },
  }

  async function getProfileInfoValidationConfigs() {
    return (await ctx.mod.env.query.modConfigs({ mod: 'userHome' })).configs.profileInfoPrimaryMsgSchemaConfigs
  }
}

const _all_user_home_permissions_disallowed: user_home_permissions = {
  editRoles: false,
  editProfile: false,
  follow: false,
  report: false,
  sendMessage: false,
}
