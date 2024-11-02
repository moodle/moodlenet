'use server'
import { appRoutes } from '../../lib/common/appRoutes'
import { getSiteGeneralInfo } from '../../lib/server/siteGeneralInfo'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const { org } = await getSiteGeneralInfo()
  const landingPath = appRoutes('/')
  return <HeaderLogo {...{ logo: org.logo, smallLogo: org.smallLogo, landingPath }} />
}
