import { useMemo } from 'react'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { MinimalisticHeaderProps } from './MinimalisticHeader.js'

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  const headerTitleProps = useHeaderTitleProps()
  const minimalisticHeaderProps = useMemo<MinimalisticHeaderProps>(() => {
    const minimalisticHeaderProps: MinimalisticHeaderProps = {
      headerTitleProps,
      centerItems: [], //TODO //@ETTO: needs a registry in react-app (miniCenterComponents)
      leftItems: [], //TODO //@ETTO: needs a registry in react-app (miniLeftComponents)
      rightItems: [], //TODO //@ETTO: needs a registry in react-app (miniRightComponents)
    }
    return minimalisticHeaderProps
  }, [headerTitleProps])

  return minimalisticHeaderProps
}
