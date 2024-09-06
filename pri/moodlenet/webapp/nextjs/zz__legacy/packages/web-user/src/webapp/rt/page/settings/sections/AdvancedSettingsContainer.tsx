import { Advanced } from '../../../../ui/exports/ui.mjs'
import { useAdvancedSettingsProps } from './AdvancedSettingsHook.mjs'

export function AdvancedSettingsContainer() {
  const advancedSettingsProps = useAdvancedSettingsProps()
  return <Advanced {...advancedSettingsProps} />
}
