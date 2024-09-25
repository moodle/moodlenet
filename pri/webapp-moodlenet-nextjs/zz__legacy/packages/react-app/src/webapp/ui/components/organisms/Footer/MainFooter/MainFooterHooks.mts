import type { AddonItem } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { useMemo } from 'react'
import { createPlugin } from '../../../../../web-lib/create-plugin.mjs'
import type { MainFooterProps } from './MainFooter'
export type FooterComponentRegItem = Omit<AddonItem, 'key'>

export const FooterPlugins = createPlugin<{
  leftComponent: AddOnMap<FooterComponentRegItem>
  centerComponent: AddOnMap<FooterComponentRegItem>
  rightComponent: AddOnMap<FooterComponentRegItem>
}>()

export const useFooterProps = (): MainFooterProps => {
  const plugins = FooterPlugins.usePluginHooks()

  const mainFooterProps = useMemo<MainFooterProps>(() => {
    const mainFooterProps: MainFooterProps = {
      leftItems: plugins.getKeyedAddons('leftComponent'),
      centerItems: plugins.getKeyedAddons('centerComponent'),
      rightItems: plugins.getKeyedAddons('rightComponent'),
    }
    return mainFooterProps
  }, [plugins])
  return mainFooterProps
}
