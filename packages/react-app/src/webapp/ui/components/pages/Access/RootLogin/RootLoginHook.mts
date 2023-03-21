import { useCallback, useMemo } from 'react'
import { useFooterProps } from '../../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { RootLoginProps } from './RootLogin.js'

export const useRootLoginProps = (): RootLoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()

  //TODO //@ETTO submitLogin & rootLoginProps need to be implemented
  const loginFailed = false
  const submitLogin = useCallback(() => undefined, [])

  const rootLoginProps = useMemo<RootLoginProps>(() => {
    return {
      headerProps,
      footerProps,
      loginFailed,
      submitLogin,
    }
  }, [headerProps, footerProps, loginFailed, submitLogin])
  return rootLoginProps
}
