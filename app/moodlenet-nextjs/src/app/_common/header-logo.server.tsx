'use server'
import { sessionContext } from '../../lib/server/sessionContext'
import { srvSiteUrls } from '../../lib/server/utils/site-urls.server'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const {
    website: { info },
  } = await sessionContext()
  const { logo, smallLogo } = await info()
  const {
    site: { landing: landingPath },
  } = await srvSiteUrls()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
