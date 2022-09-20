import { FC, useContext } from 'react'
import InstallExtension from './InstallExtension/InstallExtension'
import { MainContext } from './MainModule'

export const Menu: FC = () => {
  const { setSelectedExtInfo } = useContext(MainContext)
  return <span onClick={() => setSelectedExtInfo(null)}>Install extensions</span>
}
export const Content = InstallExtension
