import { ExtContextProviderComp } from '@moodlenet/react-app'

export const MainProvider: ExtContextProviderComp = ({ children }) => {
  // lib.header.useRegisterAvatarMenuItem(profilePageComponents)
  return <>{children}</>
}

export default MainProvider
