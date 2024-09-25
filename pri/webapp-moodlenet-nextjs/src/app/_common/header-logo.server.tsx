'use server'
import { priAccess } from '../../lib/server/session-access'
import { srvSiteUrls } from '../../lib/server/utils/site-urls.server'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const {
    org: { logo, smallLogo },
  } = await priAccess().moodle.netWebappNextjs.v1_0.pri.moodlenet.info()

  const {
    site: {
      pages: { landing: landingPath },
    },
  } = await srvSiteUrls()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
