import { moodle_core_context } from '@moodle/domain'
import { access_obj, d_u } from '@moodle/lib-types'
import { validate_userSessionInfo } from '@moodle/mod-iam/lib'
import {
  by_user_id_or_user_home_id,
  user_home_access_object,
  user_home_permissions,
} from 'domain/src/user-hone'

export async function accessUserHome({
  ctx,
  by,
}: {
  ctx: moodle_core_context
  by: by_user_id_or_user_home_id
}): Promise<d_u<{ found: access_obj<user_home_access_object>; notFound: unknown }, 'result'>> {
  const [found, findResult] = await ctx.sys_call.secondary.userHome.db.getUserHome({ by })

  if (!found) {
    return { result: 'notFound' }
  }
  const { userHome } = findResult
  const { authenticated } = await validate_userSessionInfo(ctx)
  const { profileInfo, id } = userHome
  const isPublisher = userHome.user.roles.includes('publisher')

  if (!authenticated) {
    if (isPublisher) {
      return {
        result: 'found',
        id,
        access: 'allowed',
        profileInfo,
        permissions: _all_user_home_permissions_disallowed,
        user: null,
        flags: { followed: true },
      }
    } else {
      return { result: 'found', access: 'notAllowed' }
    }
  }

  const itsMe = authenticated.user.id === userHome.user.id

  return {
    result: 'found',
    access: 'allowed',
    id,
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
      editRoles: !itsMe && authenticated.isAdmin,
    },
    user: itsMe || authenticated.isAdmin ? userHome.user : null,
    flags: { followed: !itsMe },
  }

  async function getProfileInfoValidationConfigs() {
    return (await ctx.sys_call.secondary.userHome.db.getConfigs()).configs
      .profileInfoPrimaryMsgSchemaConfigs
  }
}

const _all_user_home_permissions_disallowed: user_home_permissions = {
  editRoles: false,
  editProfile: false,
  follow: false,
  report: false,
  sendMessage: false,
}
