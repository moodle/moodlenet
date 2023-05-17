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

  const rightItems = useMemo(() => {
    return addons.rightAddons.map<AddonItem>(({ addOn: { Item }, key }) => {
      return {
        Item,
        key,
      }
    })
  }, [addons.rightAddons])

  const centerItems = useMemo(() => {
    return addons.centerAddons.map<AddonItem>(({ addOn: { Item }, key }) => {
      return {
        Item,
        key,
      }
    })
  }, [addons.centerAddons])

  const leftItems = useMemo(() => {
    return addons.leftAddons.map<AddonItem>(({ addOn: { Item }, key }) => {
      return {
        Item,
        key,
      }
    })
  }, [addons.leftAddons])

  const headerTitleProps = useHeaderTitleProps()

  const mainHeaderProps = useMemo<MainHeaderProps>(() => {
    const mainHeaderProps: MainHeaderProps = {
      headerTitleProps,
      centerItems,
      leftItems,
      rightItems,
      search: () => undefined, //TODO //@ETTO: to be changed ASAP
    }
    return mainHeaderProps
  }, [centerItems, headerTitleProps, leftItems, rightItems])
  return mainHeaderProps
}
