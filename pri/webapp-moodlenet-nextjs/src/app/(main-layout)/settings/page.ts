import { redirect } from 'next/navigation'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'

export default async function BaseSettingsPage() {
  redirect((await srvSiteUrls()).site.settings.general())
}
