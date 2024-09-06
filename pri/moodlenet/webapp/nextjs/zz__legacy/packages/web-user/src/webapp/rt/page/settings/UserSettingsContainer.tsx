import type { FC } from 'react'
import { UserSettings } from '../../../ui/exports/ui.mjs'
import { useUserSettingsProps } from './UserSettingsHooks.js'

export const UserSettingsContainer: FC = () => {
  const userSettingsProps = useUserSettingsProps()
  return <UserSettings {...userSettingsProps} />
}
