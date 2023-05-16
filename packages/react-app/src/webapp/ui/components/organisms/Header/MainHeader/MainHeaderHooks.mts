import type { AddonItem } from '@moodlenet/component-library'
import { useMemo } from 'react'
import { usePkgAddOns } from '../../../../../web-lib/add-ons.js'
import { createHookPlugin } from '../../../../../web-lib/plugins.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MainHeaderProps } from './MainHeader.js'
export type HeaderAddonRegItem = Omit<AddonItem, 'key'>

export type MainHeaderPluginHookResult = void //{ MainWrapper?: MainHeaderPluginWrapper }
const HeaderPlugins = createHookPlugin<
  {
    useHeaderRightAddons: HeaderAddonRegItem
    useHeaderCenterAddons: HeaderAddonRegItem
    useHeaderLeftAddons: HeaderAddonRegItem
  },
  (a: number) => string
>({ useHeaderCenterAddons: null, useHeaderLeftAddons: null, useHeaderRightAddons: null })

export const useHeaderProps = (): MainHeaderProps => {
  const plugins = HeaderPlugins.useHookPlugin()
  const c = plugins.mapHooks((addons, hook) => {
    return hook(2)
  })
  const rightItems = useMemo(() => {
    return headerRightAddons.map<AddonItem>(({ addOn: { Item }, key }) => {
      return {
        Item,
        key,
      }
    })
  }, [headerRightAddons])
  plugins.addonsHandles.const[(headerCenterAddons, getRegisterHeaderCenterAddons)] =
    usePkgAddOns<HeaderAddonRegItem>('HeaderCenterAddons')
  const centerItems = useMemo(() => {
    return headerCenterAddons.map<AddonItem>(({ addOn: { Item }, key }) => {
      return {
        Item,
        key,
      }
    })
  }, [headerCenterAddons])

  const [headerLeftAddons, getRegisterHeaderLeftAddons] =
    usePkgAddOns<HeaderAddonRegItem>('HeaderLeftAddons')
  const leftItems = useMemo(() => {
    return headerLeftAddons.map<AddonItem>(({ addOn: { Item }, key }) => {
      return {
        Item,
        key,
      }
    })
  }, [headerLeftAddons])

  mainHeaderPluginPlugins.forEach(({ pkgId, mainHeaderPluginHook }) => {
    mainHeaderPluginHook({
      useHeaderCenterAddons: getRegisterHeaderCenterAddons(pkgId),
      useHeaderLeftAddons: getRegisterHeaderLeftAddons(pkgId),
      useHeaderRightAddons: getRegisterHeaderRightAddons(pkgId),
    })
  })

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
