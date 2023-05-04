import type { AddonItem } from '@moodlenet/component-library'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import type { MainFooterProps } from './MainFooter.js'

export const useFooterProps = (): MainFooterProps => {
  const { reg } = useContext(MainContext)
  const leftItemsReg = reg.footerLeftComponents
  const centerItemsReg = reg.footerCenterComponents
  const rightItemsReg = reg.footerRightComponents

  const leftItems = useMemo(() => {
    return leftItemsReg.registry.entries.map<AddonItem>(({ item, pkgId }, idx) => {
      return {
        Item: item.Component,
        key: `${pkgId.name}_${idx}`,
      }
    })
  }, [leftItemsReg.registry.entries])

  const centerItems = useMemo(() => {
    return centerItemsReg.registry.entries.map<AddonItem>(({ item, pkgId }, idx) => {
      return {
        Item: item.Component,
        key: `${pkgId.name}_${idx}`,
      }
    })
  }, [centerItemsReg.registry.entries])

  const rightItems = useMemo(() => {
    return rightItemsReg.registry.entries.map<AddonItem>(({ item, pkgId }, idx) => {
      return {
        Item: item.Component,
        key: `${pkgId.name}_${idx}`,
      }
    })
  }, [rightItemsReg.registry.entries])

  const mainFooterProps = useMemo<MainFooterProps>(() => {
    return {
      leftItems,
      centerItems,
      rightItems,
    }
  }, [leftItems, centerItems, rightItems])
  return mainFooterProps
}
