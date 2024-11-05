import { redirect } from 'next/navigation'
import { srvSiteRoutes } from '../../../lib/server/utils/site-urls.server'

export default async function BaseAdminPage() {
  const adminGeneralPath = (await srvSiteRoutes()).site('/admin/general')
  console.log({ adminGeneralPath })
  redirect(adminGeneralPath)
}
