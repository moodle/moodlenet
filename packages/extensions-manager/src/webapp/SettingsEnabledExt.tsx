import { FC, useContext } from 'react'
import { MainContext } from './MainModule'
import Packages from './Packages/Packages'

export const Menu: FC = () => {
  const { setSelectedExtConfig } = useContext(MainContext)
  return <span onClick={() => setSelectedExtConfig(null)}>Manage extensions</span>
}
export const Content = Packages
