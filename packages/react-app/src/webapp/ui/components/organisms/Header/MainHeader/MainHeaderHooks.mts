import { AddonItem } from '@moodlenet/component-library'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { MainHeaderProps } from './MainHeader.js'

export const useHeaderProps = (): MainHeaderProps => {
  const { reg } = useContext(MainContext)
  const headerTitleProps = useHeaderTitleProps()
  const rightItemsRegEntries = reg.headerRightComponents.registry.entries
  const rightItems = useMemo(() => {
    return rightItemsRegEntries.map<AddonItem>(({ item, pkgId }, idx) => {
      return {
        Item: item.Component,
        key: `${pkgId.name}_${idx}`,
      }
    })
  }, [rightItemsRegEntries])

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
