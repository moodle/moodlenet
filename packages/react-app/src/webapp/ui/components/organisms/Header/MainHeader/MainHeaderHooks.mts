import type { AddonItem } from '@moodlenet/component-library'
import type { ComponentType } from 'react'
import { useMemo } from 'react'
import { usePkgAddOns } from '../../../../../web-lib/add-ons.js'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MainHeaderProps } from './MainHeader.js'
export type HeaderRightComponentItem = { Component: ComponentType }

export const useHeaderProps = (): MainHeaderProps => {
  const [headerRightComponents /* , _registerHeaderRightComponents */] =
    usePkgAddOns<HeaderRightComponentItem>('HeaderRightComponents')

  const headerTitleProps = useHeaderTitleProps()
  const rightItems = useMemo(() => {
    return headerRightComponents.map<AddonItem>(({ addOn: { Component }, key }) => {
      return {
        Item: Component,
        key,
      }
    })
  }, [headerRightComponents])

  const mainHeaderProps = useMemo<MainHeaderProps>(() => {
    const mainHeaderProps: MainHeaderProps = {
      headerTitleProps,
      centerItems: [], //TODO //@ETTO: needs a registry
      leftItems: [], //TODO //@ETTO: needs a registry
      rightItems,
      search: () => undefined, //TODO //@ETTO: to be changed ASAP
    }
    return mainHeaderProps
  }, [headerTitleProps, rightItems])
  return mainHeaderProps
}
