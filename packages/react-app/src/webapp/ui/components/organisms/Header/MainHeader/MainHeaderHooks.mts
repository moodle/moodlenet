import type { AddonItem } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { useMemo } from 'react'
import { createPluginHook } from '../../../../../web-lib/hook-plugin.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MainHeaderProps } from './MainHeader.js'
export type HeaderAddonRegItem = Omit<AddonItem, 'key'>

export const HeaderPlugins = createPluginHook<{
  rightItems?: AddOnMap<HeaderAddonRegItem>
  centerItems?: AddOnMap<HeaderAddonRegItem>
  leftItems?: AddOnMap<HeaderAddonRegItem>
}>()

export const useHeaderProps = (): MainHeaderProps => {
  const { getKeyedAddons } = HeaderPlugins.usePluginHooks()

  const headerTitleProps = useHeaderTitleProps()

  const mainHeaderProps = useMemo<MainHeaderProps>(() => {
    const mainHeaderProps: MainHeaderProps = {
      headerTitleProps,
      centerItems: getKeyedAddons('centerItems'),
      leftItems: getKeyedAddons('leftItems'),
      rightItems: getKeyedAddons('rightItems'),
    }
    return mainHeaderProps
  }, [getKeyedAddons, headerTitleProps])
  return mainHeaderProps
}
