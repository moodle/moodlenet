import type { PkgIdentifier } from '@moodlenet/core'
import {
  useFooterProps,
  useMinimalisticHeaderProps,
  usePkgAddOns,
  type UseRegisterAddOn,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { shell } from '../../../../../shell.mjs'
// import { useFooterProps } from '../../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
// import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import type { LoginItem, LoginProps } from './Login.js'

export type LoginMethodItem = Omit<LoginItem, 'key'>
export type LoginMethodHookResult = void
export type LoginMethodHook = (_: {
  useLoginMethod: UseRegisterAddOn<LoginMethodItem>
}) => void | LoginMethodHookResult

const loginMethodPlugins: {
  loginMethodHook: LoginMethodHook
  pkgId: PkgIdentifier
}[] = []

export function registerLoginMethodHook(loginMethodHook: LoginMethodHook) {
  const pkgId = shell.init.getCurrentInitPkg()
  loginMethodPlugins.push({ loginMethodHook, pkgId })
}

export const useLoginProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const [loginMethods, getRegisterLoginHook] = usePkgAddOns<LoginMethodItem>('LoginMethod')

  loginMethodPlugins.forEach(({ pkgId, loginMethodHook }) => {
    loginMethodHook({ useLoginMethod: getRegisterLoginHook(pkgId) })
  })

  const loginProps = useMemo<LoginProps>(() => {
    const loginItems = loginMethods.map(({ addOn: { Icon, Panel }, key }) => ({
      Icon,
      Panel,
      key,
    }))
    return {
      headerProps,
      footerProps,
      loginItems,
    }
  }, [loginMethods, headerProps, footerProps])
  return loginProps
}
