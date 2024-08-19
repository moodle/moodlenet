import type { FC } from 'react'
import { AdminSettingsContainer } from './AdminSettingsContainer.js'

// FIXMA: needs a settable context
const canShowAdminSettingsPage = true
export const AdminSettingsPageRoute: FC = () => {
  if (!canShowAdminSettingsPage) {
    return <div>To implement not found</div>
  }

  return <AdminSettingsContainer />
}
