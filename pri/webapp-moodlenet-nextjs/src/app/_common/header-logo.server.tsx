'use server'
import { getFileUrl } from '@moodle/lib-types'
import { priAccess } from '../../lib/server/session-access'
import { srvSiteUrls } from '../../lib/server/utils/site-urls.server'
import HeaderLogo from '../../ui/organisms/Header/HeaderLogo/HeaderLogo'

export async function LayoutHeaderLogo() {
  const { org } = await priAccess().moodle.netWebappNextjs.v1_0.pri.moodlenet.info()
  const [logo, smallLogo] = await Promise.all([getFileUrl(org.logo), getFileUrl(org.smallLogo)])
  const {
    site: {
      pages: { landing: landingPath },
    },
  } = await srvSiteUrls()
  return <HeaderLogo {...{ logo, smallLogo, landingPath }} />
}
