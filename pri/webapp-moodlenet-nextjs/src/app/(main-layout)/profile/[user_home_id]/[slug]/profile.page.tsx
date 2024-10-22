import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { primary } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import { mainProfileCardProps } from './components/MainProfileCard'
import ProfileClient from './profile.client'

export default async function ProfilePage({ params: { userHomeId, slug } }: { params: params<'userHomeId' | 'slug'> }) {
  const [foundUserHome, userHome] = await primary.moodle.userHome.userHome.access({
    by: { idOf: 'userHome', userHomeId },
  })
  if (!foundUserHome) {
    return <Fallback />
  }
  if (userHome.accessObject.profileInfo.urlSafeName !== slug) {
    redirect(sitepaths.profile[userHome.accessObject.id]![userHome.accessObject.profileInfo.urlSafeName]!())
  }

  const mainProfileCardDeps: mainProfileCardProps = {
    userHome: userHome.accessObject,
  }

  return <ProfileClient mainProfileCardDeps={mainProfileCardDeps} />
}
