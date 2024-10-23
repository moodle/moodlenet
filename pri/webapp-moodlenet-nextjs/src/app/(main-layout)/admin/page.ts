import { redirect } from 'next/navigation'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'

export default async function BaseAdminPage() {
  redirect((await srvSiteUrls()).site.admin.general())
}
