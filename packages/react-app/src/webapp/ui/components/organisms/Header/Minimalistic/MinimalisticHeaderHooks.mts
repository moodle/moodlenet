import { useMemo } from 'react'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { MinimalisticHeaderProps } from './MinimalisticHeader.js'

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  const headerTitleProps = useHeaderTitleProps()
  const minimalisticHeaderProps = useMemo<MinimalisticHeaderProps>(() => {
    const minimalisticHeaderProps: MinimalisticHeaderProps = {
      headerTitleProps,
      //TODO //@ETTO: needs registries in react-app (packages/react-app/src/webapp/registries.mts)
      centerItems: [], //TODO //@ETTO: registry name miniHeaderCenterComponents)
      leftItems: [], //TODO //@ETTO: registry name miniHeaderLeftComponents
      rightItems: [], //TODO //@ETTO: registry name miniHeaderRightComponents
    }
    return minimalisticHeaderProps
  }, [headerTitleProps])

  return minimalisticHeaderProps
}
