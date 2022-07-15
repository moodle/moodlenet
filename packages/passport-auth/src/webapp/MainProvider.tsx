import { ExtContextProviderComp } from '@moodlenet/react-app'
import lib from 'moodlenet-react-app-lib'
import * as loginComponents from './Login'

export const MainProvider: ExtContextProviderComp = ({ children }) => {
  lib.auth.useRegisterLogin(loginComponents)
  lib.auth.useRegisterSignup(loginComponents)
  return <>{children}</>
}

export default MainProvider
