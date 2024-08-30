'use server'
import { getAccessProxy } from '../../lib/server/session-access'
import { srvSiteUrls } from '../../lib/server/utils/site-urls.server'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const { d } = getAccessProxy()

  const {
    info: { logo, smallLogo },
  } = await access('net', 'read', 'website-info', void 0).val

  const {
    site: { landing: landingPath },
  } = await srvSiteUrls()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
