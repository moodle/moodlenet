import { FC, useContext } from 'react'
import { MainContext } from './MainContext.js'
import Packages from './Packages/Packages.js'

export const ManageExtensionsMenuComponent: FC = () => {
  const { setSelectedExtConfig } = useContext(MainContext)
  return <span onClick={() => setSelectedExtConfig(null)}>Manage extensions</span>
}
export const ManageExtensionsMenu = <ManageExtensionsMenuComponent />
export const ManageExtensionsContent = <Packages />
