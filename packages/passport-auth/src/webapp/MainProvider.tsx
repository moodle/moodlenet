import { ExtContextProviderComp } from '@moodlenet/react-app'
import lib from 'moodlenet-react-app-lib'
import * as loginComponents from './Login'
import * as settingsComponents from './Settings'

export const MainProvider: ExtContextProviderComp = ({ children }) => {
  lib.auth.useRegisterLogin(loginComponents)
  lib.auth.useRegisterSignup(loginComponents)
  lib.settings.useRegisterSettingsItem(settingsComponents)
  return <>{children}</>
}

export default MainProvider
