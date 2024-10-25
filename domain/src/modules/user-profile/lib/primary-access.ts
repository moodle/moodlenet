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
  const { userProfileRecord: userProfile } = findResult
  const currentUserSessionInfo = await validate_currentUserSessionInfo({ ctx })
  const { info: profileInfo, id } = userProfile
  const is_this_user_profile_contributor = userProfile.userAccountUser.roles.includes('contributor')
  if (!currentUserSessionInfo.authenticated) {
    if (!is_this_user_profile_contributor) {
      return { result: 'found', access: 'notAllowed' }
    } else {
      return {
        id,
        itsMe: false,
        result: 'found',
        access: 'allowed',
        profileInfo,
        permissions: _all_user_profile_permissions_disallowed,
        user: null,
        flags: { following: true },
        appData: {
          urlSafeProfileName: userProfile.appData.urlSafeProfileName,
          moodlenet: {
            featuredContent: userProfile.appData.moodlenet.featuredContent,
            points: userProfile.appData.moodlenet.points,
            preferences: null,
            published: {
              contributions: userProfile.appData.moodlenet.published.contributions,
            },
            stats: {
              followersCount: userProfile.appData.moodlenet.stats.followersCount,
            },
            suggestedContent: null,
          },
        },
      }
    }
  }

  const its_me = currentUserSessionInfo.authenticated.user.id === userProfile.userAccountUser.id
  const current_user_is_admin = currentUserSessionInfo.authenticated.isAdmin

  const its_me_or_admin = its_me || current_user_is_admin

  if (!(is_this_user_profile_contributor || its_me_or_admin)) {
    return { result: 'found', access: 'notAllowed' }
  }

  return {
    id,
    itsMe: its_me,
    result: 'found',
    access: 'allowed',
    profileInfo,
    permissions: {
      editProfile: its_me,
      follow: !its_me,
      report: !its_me,
      sendMessage: !its_me,
      editRoles: !its_me && current_user_is_admin,
    },
    user: its_me_or_admin ? userProfile.userAccountUser : null,
    flags: { following: !its_me },
    appData: {
      urlSafeProfileName: userProfile.appData.urlSafeProfileName,
      moodlenet: {
        featuredContent: userProfile.appData.moodlenet.featuredContent,
        points: userProfile.appData.moodlenet.points,
        preferences: its_me ? userProfile.appData.moodlenet.preferences : null,
        published: {
          contributions: userProfile.appData.moodlenet.published.contributions,
        },
        stats: {
          followersCount: userProfile.appData.moodlenet.stats.followersCount,
        },
        suggestedContent: its_me ? userProfile.appData.moodlenet.suggestedContent : null,
      },
    },
  }

}

const _all_user_profile_permissions_disallowed: userProfilePermissions = {
  editRoles: false,
  editProfile: false,
  follow: false,
  report: false,
  sendMessage: false,
}
