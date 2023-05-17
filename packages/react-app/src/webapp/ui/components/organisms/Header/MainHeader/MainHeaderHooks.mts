import type { AddonItem } from '@moodlenet/component-library'
import { useMemo } from 'react'
import { createHookPlugin } from '../../../../../web-lib/plugins.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MainHeaderProps } from './MainHeader.js'
export type HeaderAddonRegItem = Omit<AddonItem, 'key'>

export const HeaderPlugins = createHookPlugin<{
  rightAddons: HeaderAddonRegItem
  centerAddons: HeaderAddonRegItem
  leftAddons: HeaderAddonRegItem
}>({ centerAddons: null, leftAddons: null, rightAddons: null })

export const useHeaderProps = (): MainHeaderProps => {
  const [addons] = HeaderPlugins.useHookPlugin()

  const headerTitleProps = useHeaderTitleProps()

  const mainHeaderProps = useMemo<MainHeaderProps>(() => {
    const mainHeaderProps: MainHeaderProps = {
      headerTitleProps,
      centerItems: addons.centerAddons,
      leftItems: addons.leftAddons,
      rightItems: addons.rightAddons,
      search: () => undefined, //TODO //@ETTO: to be changed ASAP
    }
    return mainHeaderProps
  }, [addons.centerAddons, addons.leftAddons, addons.rightAddons, headerTitleProps])
  return mainHeaderProps
}
