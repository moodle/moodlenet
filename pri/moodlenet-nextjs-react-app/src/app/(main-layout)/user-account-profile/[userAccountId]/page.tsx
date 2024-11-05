import { redirect } from 'next/navigation'
import { appRoutes } from '../../../../lib/common/appRoutes'
import { access } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'
import { webSlug } from '@moodle/lib-types'

export default async function UserProfilePage({ params: { userAccountId } }: { params: params<'userAccountId'> }) {
  const [found, result] = await access.primary.moodlenet.admin.contributor({
    by: 'userAccountId',
    userAccountId,
  })
  if (!found) {
    return <Fallback />
  }

  redirect(
    appRoutes(
      `/profile/${result.moodlenetContributorRecord.id}/${webSlug(result.moodlenetContributorRecord.userProfile.info.displayName)}`,
    ),
  )
}
