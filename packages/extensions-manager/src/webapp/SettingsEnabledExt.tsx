import { FC, useContext } from 'react'
import { MainContext } from './MainContext.js'
import Packages from './Packages/Packages.js'

export const MenuComponent: FC = () => {
  const { setSelectedExtConfig } = useContext(MainContext)
  return <span onClick={() => setSelectedExtConfig(null)}>Manage extensions</span>
}
export const Menu = <MenuComponent />
export const Content = <Packages />
