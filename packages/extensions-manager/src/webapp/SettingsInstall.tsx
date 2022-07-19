import { FC, useContext } from 'react'
import { StateContext } from './ExtensionsProvider'
import InstallExtension from './InstallExtension/InstallExtension'

export const Menu: FC = () => {
  const { setSelectedExtInfo } = useContext(StateContext)
  return <span onClick={() => setSelectedExtInfo(null)}>Install Extensions</span>
}
export const Content = InstallExtension
