import { ExtContextProviderComp } from '@moodlenet/react-app'
import { NodeHomePageComponent } from '@moodlenet/react-app/src/webapp/ui/components/pages/ContentGraph/ContentGraphProvider'
import lib from 'moodlenet-react-app-lib'
import { useContext, useEffect } from 'react'
import * as headerComponents from './Header'
import ProfilePage from './ProfilePage/ProfilePage'

export const MainProvider: ExtContextProviderComp = ({ children }) => {
  lib.header.useRegisterAvatarMenuItem(headerComponents)
  const cg = useContext(lib.contentGraph.Context)
  useEffect(() => {
    cg.registerNodeHomePage({ Component: ProfilePageWrap, type: 'at__moodlenet__web-user__Profile' })
  }, [])

  // console.log({ ct: cg })
  return <>{children}</>
}

const ProfilePageWrap: NodeHomePageComponent<{ _kind: 'node'; _type: 'at__moodlenet__web-user__Profile' }> = ({
  node: { /* description,  */ title },
}) => {
  return <ProfilePage displayName={title} />
}
export default MainProvider
