import { FC, useContext } from 'react'
import InstallExtension from './InstallExtension/InstallExtension.js'
import { MainContext } from './MainContext.js'

export const MenuComponent: FC = () => {
  const { setSelectedExtInfo } = useContext(MainContext)
  return <span onClick={() => setSelectedExtInfo(null)}>Install extensions</span>
}
export const Menu = <MenuComponent />
export const Content = <InstallExtension />
