'use server'
import { getFileUrl } from '@moodle/lib-types'
import { sitepaths } from '../../lib/common/utils/sitepaths'
import { priAccess } from '../../lib/server/session-access'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const { org } = await priAccess().moodle.netWebappNextjs.pri.moodlenet.info()
  const [logo, smallLogo] = await Promise.all([getFileUrl(org.logo), getFileUrl(org.smallLogo)])
  const landingPath = sitepaths().pages.landing
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
