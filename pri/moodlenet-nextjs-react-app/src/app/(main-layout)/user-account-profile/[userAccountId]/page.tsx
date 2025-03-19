import { webSlug } from '@moodle/lib-types'
import { redirect } from 'next/navigation'
import { appRoutes } from '../../../../lib/common/appRoutes'
import { pageProps, paramRequired } from '../../../../lib/server/page-props'
import session from '../../../../lib/server/session-client'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'

export default async function UserProfilePage({ params }: pageProps<{ userAccountId: string }>) {
  const my = await client.my
  const userAccountId = await paramRequired('userAccountId', params)
  const res = await my.gate.any.moodlenet.viewPublicContent.entity.contributor().send?.({
    by: 'userAccountId',
    userAccountId,
  })
  if (!res) {
    return <Fallback />
  }

  redirect(appRoutes(`/profile/${result.moodlenetContributorRecord.id}/${webSlug(result.moodlenetContributorRecord.userProfile.info.displayName)}`))
}
