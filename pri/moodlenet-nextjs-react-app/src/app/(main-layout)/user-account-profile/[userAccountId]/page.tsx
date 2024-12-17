import { webSlug } from '@moodle/lib-types'
import { redirect } from 'next/navigation'
import { appRoutes } from '../../../../lib/common/appRoutes'
import { pageProps, paramRequired } from '../../../../lib/server/page-props'
import { access } from '../../../../lib/server/session-access'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'

export default async function UserProfilePage({ params }: pageProps<{ userAccountId: string }>) {
  const userAccountId = await paramRequired('userAccountId', params)
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
