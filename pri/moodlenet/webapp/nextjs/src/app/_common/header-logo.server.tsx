'use server'
import { getMod } from '../../lib/server/session-access'
import { srvSiteUrls } from '../../lib/server/utils/site-urls.server'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const {
    moodle: {
      net: {
        v0_1: { pri: net },
      },
    },
  } = getMod()

  const {
    configs: {
      info: { logo, smallLogo },
    },
  } = await net.configs.read()

  const {
    site: { landing: landingPath },
  } = await srvSiteUrls()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
