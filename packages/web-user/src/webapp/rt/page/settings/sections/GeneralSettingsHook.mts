import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { createPlugin } from '@moodlenet/react-app/webapp'
import type { GeneralProps } from '../../../../ui/exports/ui.mjs'

export const GeneralSettingsPlugin = createPlugin<{
  mainColumn: AddOnMap<AddonItemNoKey>
}>()

export function useGeneralSettingsProps() {
  const plugins = GeneralSettingsPlugin.usePluginHooks()
  const generalProps: GeneralProps = {
    mainColumnItems: plugins.getKeyedAddons('mainColumn'),
  }
  return generalProps
}
