'use server'
import { getAccess } from '../../lib/server/session-access'
import { srvSiteUrls } from '../../lib/server/utils/site-urls.server'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const access = await getAccess()

  const {
    info: { logo, smallLogo },
  } = await access('net', 'read', 'website-info', void 0).val

  const {
    site: { landing: landingPath },
  } = await srvSiteUrls()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
