import type { FC } from 'react'
import { Fallback } from '../../Extra/Fallback/Fallback.js'
import { AdminSettings } from '../AdminSettings.js'
import { useAdminSettingsProps } from './AdminSettingsHook.js'

export const AdminSettingsContainer: FC = () => {
  const { adminSettingsProps, denyAccess } = useAdminSettingsProps()

  return denyAccess ? (
    <Fallback mainLayoutProps={adminSettingsProps.mainLayoutProps} />
  ) : (
    <AdminSettings {...adminSettingsProps} />
  )
}
