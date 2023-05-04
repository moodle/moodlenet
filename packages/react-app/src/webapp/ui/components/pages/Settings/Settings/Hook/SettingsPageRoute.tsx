import type { FC } from 'react'
import { SettingsContainer } from './SettingsContainer.js'

// FIXMA: needs a settable context
const canShowSettingsPage = true
export const SettingsPageRoute: FC = () => {
  if (!canShowSettingsPage) {
    return <div>To implement not found</div>
  }

  return <SettingsContainer />
}
