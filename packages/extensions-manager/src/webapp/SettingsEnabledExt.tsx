import { FC, useContext } from 'react'
import { StateContext } from './ExtensionsProvider'
import Packages from './Packages/Packages'

export const Menu: FC = () => {
  const { setSelectedExtConfig } = useContext(StateContext)
  return <span onClick={() => setSelectedExtConfig(null)}>Installed Extensions</span>
}
export const Content = Packages
