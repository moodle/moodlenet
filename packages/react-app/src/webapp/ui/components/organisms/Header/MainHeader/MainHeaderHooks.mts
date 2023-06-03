import type { AddonItem } from '@moodlenet/component-library'
import { useMemo } from 'react'
import { createHookPlugin } from '../../../../../web-lib/plugins.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MainHeaderProps } from './MainHeader.js'
export type HeaderAddonRegItem = Omit<AddonItem, 'key'>

export const HeaderPlugins = createHookPlugin<{
  rightItems: HeaderAddonRegItem
  centerItems: HeaderAddonRegItem
  leftItems: HeaderAddonRegItem
}>({ centerItems: null, leftItems: null, rightItems: null })

export const useHeaderProps = (): MainHeaderProps => {
  const [addons] = HeaderPlugins.useHookPlugin()

  const headerTitleProps = useHeaderTitleProps()

  const mainHeaderProps = useMemo<MainHeaderProps>(() => {
    const mainHeaderProps: MainHeaderProps = {
      headerTitleProps,
      centerItems: addons.centerItems,
      leftItems: addons.leftItems,
      rightItems: addons.rightItems,
    }
    return mainHeaderProps
  }, [addons.centerItems, addons.leftItems, addons.rightItems, headerTitleProps])
  return mainHeaderProps
}
