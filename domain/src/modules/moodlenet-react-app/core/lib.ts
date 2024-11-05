import { _nullish, ok_ko, webSlug } from '@moodle/lib-types'
import { primaryContext } from '../../../types'
import {
  accessMoodlenetContributor,
  contributorRecordToContributorAccessObject,
} from '../../moodlenet/core/lib/primary-access'
import { moodlenetContributorAccessObject, moodlenetContributorId, moodlenetContributorRecord } from '../../moodlenet/types'
import { webappContributorAccessData } from '../types'

export function contributorAccessObjectToWebappContributorAccessData(
  moodlenetContributorAccessObject: moodlenetContributorAccessObject,
): webappContributorAccessData {
  return {
    ...moodlenetContributorAccessObject,
    slug: webSlug(moodlenetContributorAccessObject.profileInfo.displayName),
  }
}
export function contributorRecordToWebappContributorAccessData({
  moodlenetContributorRecord,
  me,
}: {
  moodlenetContributorRecord: moodlenetContributorRecord
  me: _nullish | Pick<moodlenetContributorRecord, 'id' | 'linkedContent'>
}): webappContributorAccessData {
  return contributorAccessObjectToWebappContributorAccessData(
    contributorRecordToContributorAccessObject({
      moodlenetContributorRecord,
      me,
    }),
  )
}

export async function accessWebappContributorAccessData({
  ctx,
  id,
}: {
  ctx: primaryContext<any>
  id: moodlenetContributorId
}): Promise<ok_ko<webappContributorAccessData, { notFound: unknown; notAllowed: unknown }>> {
  const [gotIt, result] = await accessMoodlenetContributor({
    ctx,
    id,
  })
  if (!gotIt) {
    return [false, result]
  }
  return [true, contributorAccessObjectToWebappContributorAccessData(result)]
}
