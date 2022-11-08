import { FC } from 'react'
import { Appearance } from './Appearance.js'
import { useAppearanceProps } from './AppearanceHooks.js'

export const AppearanceContainer: FC = () => {
  const appearanceProps = useAppearanceProps()
  return <Appearance {...appearanceProps} />
}
