import { Advanced } from '../../../../ui/exports/ui.mjs'
import { useLmsSettingsProps } from './LMSSettingsHook.mjs'

export function LMSSettingsContainer() {
  const lmsSettingsProps = useLmsSettingsProps()
  return lmsSettingsProps && <Advanced {...lmsSettingsProps} />
}
