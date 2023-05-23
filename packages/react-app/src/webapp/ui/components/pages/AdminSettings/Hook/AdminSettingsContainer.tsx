import type { FC } from 'react'
import { AdminSettings } from '../AdminSettings.js'
import { useAdminSettingsProps } from './AdminSettingsHook.js'

export const AdminSettingsContainer: FC = () => {
  const AdminSettingsProps = useAdminSettingsProps()

  return <AdminSettings {...AdminSettingsProps} />
}
