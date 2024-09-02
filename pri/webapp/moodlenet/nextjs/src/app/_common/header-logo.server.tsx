'use server'
import { getMod } from '../../lib/server/session-access'
import { srvSiteUrls } from '../../lib/server/utils/site-urls.server'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const {
    moodle: {
      net: {
        V0_1: { pri: net },
      },
    },
  } = getMod()

  const { logo, smallLogo } = await net.website.info()

  const {
    site: { landing: landingPath },
  } = await srvSiteUrls()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
