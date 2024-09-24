import type { FC } from 'react'
import { Appearance } from './Appearance'
import { useAppearanceProps } from './AppearanceHooks'

export const AppearanceContainer: FC = () => {
  const appearanceProps = useAppearanceProps()
  return <Appearance {...appearanceProps} />
}
