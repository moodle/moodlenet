import { _nullish, d_u, ok_ko } from '@moodle/lib-types'
import { primaryContext } from '../../../../types'
import { userSessionInfo } from '../../../user-account'
import { validate_currentUserSessionInfo } from '../../../user-account/lib'
import { userProfileId } from '../../../user-profile'
import {
  moodlenetContributorAccessObject,
  moodlenetContributorId,
  moodlenetContributorRecord,
} from '../../types/access-objects/contributor'

export async function accessMoodlenetContributor({
  ctx,
  id,
}: {
  ctx: primaryContext<any>
  id: moodlenetContributorId
}): Promise<ok_ko<moodlenetContributorAccessObject, { notAllowed: unknown; notFound: unknown }>> {
  const [found, queryResult] = await ctx.mod.secondary.moodlenet.query.contributor({
    select: {
      by: 'moodlenetContributorId',
      moodlenetContributorId: id,
    },
    noAccessLevelFilter: true, // !! noAccessLevelFilter
  })
  if (!found) {
    return [false, { reason: 'notFound' }]
  }
  const { moodlenetContributorRecord } = queryResult
  const currentUserSessionInfo = await validate_currentUserSessionInfo({ ctx })
  const itsMe = isMeMoodlenetContributorRecord({
    moodlenetContributorRecord,
    myId: { of: 'userSessionInfo', userSessionInfo: currentUserSessionInfo },
  })
  const current_user_is_admin = currentUserSessionInfo.authenticated && currentUserSessionInfo.authenticated.isAdmin
  const its_me_or_admin = itsMe || current_user_is_admin

  if (moodlenetContributorRecord.access === 'protected' && !its_me_or_admin) {
    return [false, { reason: 'notAllowed' }]
  }
  const myUserRecords = await ctx.forward.moodlenet.session.getMySessionUserRecords()
  const me = myUserRecords.type === 'authenticated' ? myUserRecords.moodlenetContributorRecord : null
  const accessObj = contributorRecordToContributorAccessObject({ moodlenetContributorRecord, me })
  return [true, accessObj]
}
export function isMeMoodlenetContributorRecord({
  moodlenetContributorRecord,
  myId,
}: {
  moodlenetContributorRecord: moodlenetContributorRecord
  myId: d_u<
    {
      userSessionInfo: { userSessionInfo: userSessionInfo }
      userProfile: { userProfileId: userProfileId }
      moodlenetContributor: { moodlenetContributorId: moodlenetContributorId }
    },
    'of'
  >
}): boolean {
  const itsMe =
    myId.of === 'userProfile'
      ? myId.userProfileId === moodlenetContributorRecord.userProfile.id
      : myId.of === 'moodlenetContributor'
        ? myId.moodlenetContributorId === moodlenetContributorRecord.id
        : myId.of === 'userSessionInfo'
          ? myId.userSessionInfo.authenticated &&
            myId.userSessionInfo.authenticated.profile.id === moodlenetContributorRecord.userProfile.id
          : false
  return itsMe
}
export function contributorRecordToContributorAccessObject({
  moodlenetContributorRecord,
  me,
}: {
  moodlenetContributorRecord: moodlenetContributorRecord
  me: _nullish | Pick<moodlenetContributorRecord, 'id' | 'linkedContent'>
}): moodlenetContributorAccessObject {
  const itsMe = !!me && me.id === moodlenetContributorRecord.id
  const myLinks: moodlenetContributorAccessObject['myLinks'] = {
    followed: !!me && !!me.linkedContent.follow.moodlenetContributors.find(({ id }) => id === moodlenetContributorRecord.id),
  }
  return {
    myLinks,
    id: moodlenetContributorRecord.id,
    profileInfo: moodlenetContributorRecord.userProfile.info,
    permissions: {
      editProfileInfo: itsMe,
      follow: !itsMe,
      report: !itsMe,
      sendMessage: !itsMe,
    },
    contributions: moodlenetContributorRecord.contributions,
    linkedContent: moodlenetContributorRecord.linkedContent,
    stats: {
      points: moodlenetContributorRecord.stats.points,
      followersCount: moodlenetContributorRecord.stats.followersCount,
      followingCount: moodlenetContributorRecord.stats.followingCount,
      publishedResourcesCount: moodlenetContributorRecord.stats.publishedResourcesCount,
    },
  }
}
