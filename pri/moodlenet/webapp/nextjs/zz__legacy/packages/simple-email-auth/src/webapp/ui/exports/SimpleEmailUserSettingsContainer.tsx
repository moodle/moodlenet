import { useSimpleEmailUserSettingsProps } from './SimpleEmailUserSettingsHooks.mjs'
import { SimpleEmailUserSettings } from './UserSettings'

export function SimpleEmailUserSettingsContainer() {
  const simpleEmailUserSettingsProps = useSimpleEmailUserSettingsProps()
  return (
    simpleEmailUserSettingsProps && <SimpleEmailUserSettings {...simpleEmailUserSettingsProps} />
  )
}
