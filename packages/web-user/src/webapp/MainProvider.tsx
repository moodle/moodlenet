import { ExtContextProviderComp } from '@moodlenet/react-app'
import lib from 'moodlenet-react-app-lib'
import { useContext } from 'react'
import * as headerComponents from './Header'

export const MainProvider: ExtContextProviderComp = ({ children }) => {
  lib.header.useRegisterAvatarMenuItem(headerComponents)
  const ct = useContext(lib.contentGraph.Context)
  // ct.registerNodeHomePage({ component: () => null })
  console.log({ ct })
  return <>{children}</>
}

export default MainProvider
