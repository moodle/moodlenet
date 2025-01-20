import { redirect } from 'next/navigation'
import { appRoutes } from '../../../lib/common/appRoutes'

export default async function BaseSettingsPage() {
  redirect(appRoutes('/settings/general'))
}
