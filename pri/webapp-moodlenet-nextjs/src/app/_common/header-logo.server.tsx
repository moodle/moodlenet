'use server'
import { getFileUrl } from '@moodle/lib-types'
import { sitepaths } from '../../lib/common/utils/sitepaths'
import { getSiteGeneralInfo } from '../../lib/server/siteGeneralInfo'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const { org } = await getSiteGeneralInfo()
  const [logo, smallLogo] = await Promise.all([getFileUrl(org.logo), getFileUrl(org.smallLogo)])
  const landingPath = sitepaths()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
