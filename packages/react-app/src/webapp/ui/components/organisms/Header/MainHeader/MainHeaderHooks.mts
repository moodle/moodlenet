import type { AddonItem } from '@moodlenet/component-library'
import type { PkgIdentifier } from '@moodlenet/core'
import { useMemo } from 'react'
import { shell } from '../../../../../shell.mjs'
import type { UseRegisterAddOn } from '../../../../../web-lib/add-ons.js'
import { usePkgAddOns } from '../../../../../web-lib/add-ons.js'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MainHeaderProps } from './MainHeader.js'
export type HeaderAddonRegItem = Omit<AddonItem, 'key'>

export type MainHeaderPluginHookResult = void //{ MainWrapper?: MainHeaderPluginWrapper }
export type MainHeaderPluginHook = (_: {
  useHeaderRightAddons: UseRegisterAddOn<HeaderAddonRegItem>
  useHeaderCenterAddons: UseRegisterAddOn<HeaderAddonRegItem>
  useHeaderLeftAddons: UseRegisterAddOn<HeaderAddonRegItem>
}) => void | MainHeaderPluginHookResult

const mainHeaderPluginPlugins: {
  mainHeaderPluginHook: MainHeaderPluginHook
  pkgId: PkgIdentifier
}[] = []

export function registerMainHeaderPluginHook(mainHeaderPluginHook: MainHeaderPluginHook) {
  const pkgId = shell.init.getCurrentInitPkg()
  mainHeaderPluginPlugins.push({ mainHeaderPluginHook, pkgId })
}

export const useHeaderProps = (): MainHeaderProps => {
  const [headerRightAddons, getRegisterHeaderRightAddons] =
    usePkgAddOns<HeaderAddonRegItem>('HeaderRightAddons')
  const rightItems = useMemo(() => {
    return headerRightAddons.map<AddonItem>(({ addOn: { Item }, key }) => {
      return {
        Item,
        key,
      }
    })
  }, [headerRightAddons])

  const [headerCenterAddons, getRegisterHeaderCenterAddons] =
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
