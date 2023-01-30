import { FC } from 'react'
import { Settings } from '../Settings.js'
import { useSettingsProps } from './SettingsHooks.js'

export const SettingsContainer: FC = () => {
  const settingsProps = useSettingsProps()

  return <Settings {...settingsProps} />
}
