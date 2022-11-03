import { FC, useContext } from 'react'
import { MainContext } from './MainContext.js'
import Packages from './Packages/Packages.js'

export const Menu: FC = () => {
  const { setSelectedExtConfig } = useContext(MainContext)
  return <span onClick={() => setSelectedExtConfig(null)}>Manage extensions</span>
}
export const Content = Packages
