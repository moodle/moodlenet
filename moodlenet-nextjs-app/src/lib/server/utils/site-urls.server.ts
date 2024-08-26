import { sitepaths } from '../../../lib/common/utils/sitepaths'
import { sessionContext } from '../sessionContext'

export async function srvSiteUrls() {
  const {
    website: { deployment },
  } = await sessionContext()
  const { basePath, domain, secure } = await deployment()
  const baseUrl = `${secure ? 'https' : 'http'}://${domain}${basePath}`
  return {
    full: sitepaths(baseUrl),
    site: sitepaths(basePath),
  }
}
