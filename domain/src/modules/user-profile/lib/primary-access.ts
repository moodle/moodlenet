import { access_obj, d_u } from '@moodle/lib-types'
import { get_user_profile_by, userProfileAccessObject, userProfilePermissions } from '..'
import { sessionLibDep, validate_currentUserSessionInfo } from '../../user-account/lib'

// REVIEW : consider put this access logic - as well as `access_obj` - in `userAccount` (a as access)
// or consider renaming `userAccount` to `im` or something
export async function accessUserProfile({
  ctx,
  ...by
}: sessionLibDep & get_user_profile_by): Promise<
  d_u<{ found: access_obj<userProfileAccessObject>; notFound: unknown }, 'result'>
> {
  const [found, findResult] = await ctx.mod.userProfile.query.getUserProfile(by)

  if (!found) {
    return { result: 'notFound' }
  }
  const { userProfile } = findResult
  const currentUserSessionInfo = await validate_currentUserSessionInfo({ ctx })
  const { info: profileInfo, id } = userProfile
  const isThisUserProfilePublisher = userProfile.userAccountUser.roles.includes('publisher')
  if (!currentUserSessionInfo.authenticated) {
    if (!isThisUserProfilePublisher) {
      return { result: 'found', access: 'notAllowed' }
    } else {
      return {
        id,
        result: 'found',
        access: 'allowed',
        profileInfo,
        permissions: _all_user_profile_permissions_disallowed,
        user: null,
        flags: { followed: true },
        urlSafeProfileName: userProfile.appData.urlSafeProfileName,
      }
    }
  }

  const itsMe = currentUserSessionInfo.authenticated.user.id === userProfile.userAccountUser.id
  const currentUserIsAdmin = currentUserSessionInfo.authenticated.isAdmin

  if (!(isThisUserProfilePublisher || itsMe || currentUserIsAdmin)) {
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
    user: itsMe || currentUserIsAdmin ? userProfile.userAccountUser : null,
    flags: { followed: !itsMe },
    urlSafeProfileName: userProfile.appData.urlSafeProfileName,
  }

  async function getProfileInfoValidationConfigs() {
    return (await ctx.mod.env.query.modConfigs({ mod: 'userProfile' })).configs.profileInfoPrimaryMsgSchemaConfigs
  }
}

const _all_user_profile_permissions_disallowed: userProfilePermissions = {
  editRoles: false,
  editProfile: false,
  follow: false,
  report: false,
  sendMessage: false,
}
