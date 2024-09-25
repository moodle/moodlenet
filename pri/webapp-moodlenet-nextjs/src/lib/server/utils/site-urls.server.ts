import { url_string } from '@moodle/lib-types'
import { sitepaths } from '../../common/utils/sitepaths'
import { priAccess } from '../session-access'

export async function srvSiteUrls() {
  const { basePath, domain, secure } =
    await priAccess().moodle.netWebappNextjs.v1_0.pri.webapp.deployment()

  const baseUrl = `${secure ? 'https' : 'http'}://${domain}${basePath}`
  return {
    full: sitepaths<url_string>(baseUrl),
    site: sitepaths(basePath),
  }
}
