import { redirect } from 'next/navigation'
import { srvSiteRoutes } from '../../../lib/server/utils/site-urls.server'

export default async function BaseSettingsPage() {
  redirect((await srvSiteRoutes()).site('/settings/general'))
}
