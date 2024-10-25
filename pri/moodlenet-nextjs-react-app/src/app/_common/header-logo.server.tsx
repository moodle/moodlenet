'use server'
import { getAssetUrl } from '@moodle/module/storage/lib'
import { sitepaths } from '../../lib/common/utils/sitepaths'
import { getSiteGeneralInfo } from '../../lib/server/siteGeneralInfo'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const { org } = await getSiteGeneralInfo()
  const landingPath = sitepaths()
  return <HeaderLogo {...{ logo: org.logo, smallLogo: org.smallLogo, landingPath }} />
}
