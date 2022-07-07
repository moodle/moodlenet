import { ExtContextProviderComp } from '@moodlenet/react-app'
import lib from 'moodlenet-react-app-lib'
import * as loginComponents from './Login'
import * as signupComponents from './Signup'

export const MainProvider: ExtContextProviderComp = ({ children }) => {
  lib.auth.useRegisterLogin(loginComponents)
  lib.auth.useRegisterSignup(signupComponents)
  return <>{children}</>
}

export default MainProvider
