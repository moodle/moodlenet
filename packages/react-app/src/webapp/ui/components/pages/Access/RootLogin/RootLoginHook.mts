import { useCallback, useContext, useMemo, useState } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { useSimpleLayoutProps } from '../../../layout/SimpleLayout/SimpleLayoutHooks.mjs'
import { RootLoginProps } from './RootLogin.js'

export const useRootLoginProps = (): RootLoginProps => {
  const simpleLayoutProps = useSimpleLayoutProps()
  const {
    use: {
      me: { rpc },
    },
  } = useContext(MainContext)

  const [loginFailed, setLoginFailed] = useState(false)
  const submitLogin = useCallback<RootLoginProps['submitLogin']>(
    rootPassword => rpc.loginAsRoot({ rootPassword }).then(success => setLoginFailed(!success)),
    [rpc],
  )

  const rootLoginProps = useMemo<RootLoginProps>(() => {
    return {
      simpleLayoutProps,
      loginFailed,
      submitLogin,
    }
  }, [simpleLayoutProps, loginFailed, submitLogin])
  return rootLoginProps
}
