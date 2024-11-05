import { General } from '../../../../ui/exports/ui.mjs'
import { useGeneralSettingsProps } from './GeneralSettingsHook.mjs'

export function GeneralSettingsContainer() {
  const generalSettingsProps = useGeneralSettingsProps()
  return generalSettingsProps && <General {...generalSettingsProps} />
}
