import { siteUrls } from '@/lib/common/utils/site-urls'
import { sessionContext } from '../sessionContext'

export async function srvSiteUrls() {
  const {
    website: { info },
  } = await sessionContext()
  const { basePath, domain, secure } = await info()
  const baseUrl = `${secure ? 'https' : 'http'}://${domain}${basePath}`
  return {
    full: siteUrls(baseUrl),
    site: siteUrls(basePath),
  }
}
