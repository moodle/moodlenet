import { access_obj, found_access_obj } from '@moodle/lib-types'
import { userSessionInfo } from '../../../user-account'
import { sessionLibDep, validate_currentUserSessionInfo } from '../../../user-account/lib'
import {
  moodlenetContributorAccessObject,
  moodlenetContributorId,
  moodlenetContributorRecord,
} from '../../types/moodlenet-contributor'

export async function accessMoodlenetContributor({
  ctx,
  id,
}: sessionLibDep & { id: moodlenetContributorId }): Promise<found_access_obj<moodlenetContributorAccessObject>> {
  const [found, findResult] = await ctx.mod.secondary.moodlenet.query.contributor({
    select: {
      by: 'moodlenetContributorId',
      moodlenetContributorId: id,
    },
    noAccessLevelFilter: true,
  })
  console.log({ found, findResult })
  if (!found) {
    return { result: 'notFound' }
  }
  const { moodlenetContributorRecord } = findResult
  const currentUserSessionInfo = await validate_currentUserSessionInfo({ ctx })
  const accessObj = getMoodlenetContributorAccessObject({ moodlenetContributorRecord, currentUserSessionInfo })
  return { result: 'found', ...accessObj }
}

export function getMoodlenetContributorAccessObject({
  moodlenetContributorRecord,
  currentUserSessionInfo,
}: {
  currentUserSessionInfo: userSessionInfo
  moodlenetContributorRecord: moodlenetContributorRecord
}): access_obj<moodlenetContributorAccessObject> {
  const its_me =
    currentUserSessionInfo.authenticated &&
    currentUserSessionInfo.authenticated.profile.id === moodlenetContributorRecord.userProfile.id
  const current_user_is_admin = currentUserSessionInfo.authenticated && currentUserSessionInfo.authenticated.isAdmin

  const its_me_or_admin = its_me || current_user_is_admin
  if (moodlenetContributorRecord.access.level === 'protected' && !its_me_or_admin) {
    return { access: 'notAllowed' }
  } else {
    return {
      access: 'allowed',
      itsMe: its_me,
      slug: moodlenetContributorRecord.slug,
      id: moodlenetContributorRecord.id,
      profileInfo: moodlenetContributorRecord.userProfile.info,
      permissions: {
        editProfileInfo: its_me,
        follow: !its_me,
        report: !its_me,
        sendMessage: !its_me,
      },
      contributions: moodlenetContributorRecord.contributions,
      linkedContent: moodlenetContributorRecord.linkedContent,
      stats: {
        points: moodlenetContributorRecord.stats.points,
      },
    }
  }
}
