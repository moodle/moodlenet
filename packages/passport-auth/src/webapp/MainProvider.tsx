import { ExtContextProviderComp } from '@moodlenet/react-app'
import lib from 'moodlenet-react-app-lib'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { PassportAuthExt } from '..'
import { PassportConfigs } from '../store/types'
import * as loginComponents from './Login'
import * as settingsComponents from './Settings'

type ProviderConfiguredFlags = { [provider in keyof PassportConfigs]?: boolean }
export type PassportContextT = {
  configFlags: ProviderConfiguredFlags
  configs: PassportConfigs
  save(configs: PassportConfigs): Promise<void>
}
const passportSrv = lib.priHttp.fetch<PassportAuthExt>('@moodlenet/passport-auth', '0.1.0')
export const PassportContext = createContext<PassportContextT>(null as any)
export const MainProvider: ExtContextProviderComp = ({ children }) => {
  lib.auth.useRegisterLogin(loginComponents)
  lib.auth.useRegisterSignup(loginComponents)
  lib.settings.useRegisterSettingsItem(settingsComponents)
  const [configs, setConfig] = useState<PassportConfigs>({})
  useEffect(() => {
    passportSrv('get')().then(({ configs }) => setConfig(configs))
  }, [])

  const save = useCallback<PassportContextT['save']>(configs => {
    return passportSrv('save')({ configs }).then(({ configs }) => setConfig(configs))
  }, [])

  const ctx = useMemo<PassportContextT>(() => {
    const configFlags: ProviderConfiguredFlags = {
      google: !!configs.google,
    }
    const _ctx = {
      configs,
      configFlags,
      save,
    }
    return _ctx
  }, [save, configs])

  return <PassportContext.Provider value={ctx}>{children}</PassportContext.Provider>
}

export default MainProvider
