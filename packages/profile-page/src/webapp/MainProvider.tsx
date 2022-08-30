import { ContentGraphReactAppLib } from '@moodlenet/content-graph'
import { ExtContextProviderComp } from '@moodlenet/react-app'
import lib from 'moodlenet-react-app-lib'
import { useContext } from 'react'

export const MainProvider: ExtContextProviderComp = ({ children }) => {
  // lib.header.useRegisterAvatarMenuItem(profilePageComponents)
  const xxxx = lib.getExposed<ContentGraphReactAppLib>('@moodlenet/content-graph')
  console.log({ xxxx })
  const ct = useContext(xxxx.ContentGraphContext)
  // ct.registerNodeHomePage({ component: () => null })
  console.log({ ct })
  return <>{children}</>
}

export default MainProvider
