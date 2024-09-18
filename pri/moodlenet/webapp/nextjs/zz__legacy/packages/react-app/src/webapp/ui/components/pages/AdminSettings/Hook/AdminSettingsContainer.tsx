import type { FC } from 'react'
import { Fallback } from '../../Extra/Fallback/Fallback'
import { AdminSettings } from '../AdminSettings'
import { useAdminSettingsProps } from './AdminSettingsHook'

export const AdminSettingsContainer: FC = () => {
  const { adminSettingsProps, denyAccess } = useAdminSettingsProps()

  return denyAccess ? (
    <Fallback mainLayoutProps={adminSettingsProps.mainLayoutProps} />
  ) : (
    <AdminSettings {...adminSettingsProps} />
  )
}
