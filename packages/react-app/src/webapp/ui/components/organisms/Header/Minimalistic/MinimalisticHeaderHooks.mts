import { useMemo } from 'react'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MinimalisticHeaderProps } from './MinimalisticHeader.js'

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  const headerTitleProps = useHeaderTitleProps()
  const minimalisticHeaderProps = useMemo<MinimalisticHeaderProps>(() => {
    const minimalisticHeaderProps: MinimalisticHeaderProps = {
      headerTitleProps,
      //TODO //@ALE: MinimalisticHeader needs registries in react-app (packages/react-app/src/webapp/registries.mts)
      centerItems: [], //TODO //@ALE: MinimalisticHeader registry name miniHeaderCenterComponents)
      leftItems: [], //TODO //@ALE: MinimalisticHeader registry name miniHeaderLeftComponents
      rightItems: [], //TODO //@ALE: MinimalisticHeader registry name miniHeaderRightComponents
    }
    return minimalisticHeaderProps
  }, [headerTitleProps])

  return minimalisticHeaderProps
}
