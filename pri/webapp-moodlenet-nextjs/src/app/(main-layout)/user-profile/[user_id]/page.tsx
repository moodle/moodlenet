import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { priAccess } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'

export default async function UserProfilePage({ params: { user_id } }: { params: params<'user_id'> }) {
  const [found, userHome] = await priAccess().userHome.userHome.access({ by: { idOf: 'user', user_id } })
  if (!found) {
    return <Fallback />
  }
  const profileInfo = userHome.accessObject.profileInfo
  redirect(sitepaths.profile[userHome.accessObject.id]![profileInfo.urlSafeName]!())
}
