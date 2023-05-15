import type { AddonItem } from '@moodlenet/component-library'
import type { ComponentType } from 'react'
import { useMemo } from 'react'
import { usePkgAddOns } from '../../../../../web-lib/add-ons.js'
import type { MainFooterProps } from './MainFooter.js'
export type FooterComponentRegItem = { Component: ComponentType }

export const useFooterProps = (): MainFooterProps => {
  const [footerLeftComponents /* , _registerFooterLeftComponents*/] =
    usePkgAddOns<FooterComponentRegItem>('FooterLeftComponents')
  const [footerCenterComponents /* , _registerFooterCenterComponents*/] =
    usePkgAddOns<FooterComponentRegItem>('FooterCenterComponents')
  const [footerRightComponents /* , _registerFooterRightComponents*/] =
    usePkgAddOns<FooterComponentRegItem>('FooterRightComponents')

  const leftItems = useMemo(() => {
    return footerLeftComponents.map<AddonItem>(({ addOn: { Component }, key }) => {
      return {
        Item: Component,
        key,
      }
    })
  }, [footerLeftComponents])

  const centerItems = useMemo(() => {
    return footerCenterComponents.map<AddonItem>(({ addOn: { Component }, key }) => {
      return {
        Item: Component,
        key,
      }
    })
  }, [footerCenterComponents])

  const rightItems = useMemo(() => {
    return footerRightComponents.map<AddonItem>(({ addOn: { Component }, key }) => {
      return {
        Item: Component,
        key,
      }
    })
  }, [footerRightComponents])

  const mainFooterProps = useMemo<MainFooterProps>(() => {
    return {
      leftItems,
      centerItems,
      rightItems,
    }
  }, [leftItems, centerItems, rightItems])
  return mainFooterProps
}
