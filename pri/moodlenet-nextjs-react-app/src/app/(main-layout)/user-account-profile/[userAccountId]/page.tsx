import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../lib/common/sitepaths'
import { access } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'

export default async function UserProfilePage({ params: { userAccountId } }: { params: params<'userAccountId'> }) {
  const [found, result] = await access.primary.moodlenet.admin.contributor({
    by: 'userAccountId',
    userAccountId,
  })
  if (!found) {
    return <Fallback />
  }

  redirect(sitepaths.profile[result.moodlenetContributorRecord.id]![result.moodlenetContributorRecord.slug]!())
}
