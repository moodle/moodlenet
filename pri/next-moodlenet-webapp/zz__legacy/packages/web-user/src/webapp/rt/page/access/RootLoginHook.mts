import { useSimpleLayoutProps } from '@moodlenet/react-app/webapp'
import { useCallback, useMemo, useState } from 'react'
import type { RootLoginProps } from '../../../ui/exports/ui.mjs'
import { shell } from '../../shell.mjs'

export const useRootLoginProps = (): RootLoginProps => {
  const simpleLayoutProps = useSimpleLayoutProps()

  const [loginFailed, setLoginFailed] = useState(false)
  const submitLogin = useCallback<RootLoginProps['submitLogin']>(
    rootPassword =>
      shell.rpc
        .me('loginAsRoot')({ rootPassword })
        .then(success => setLoginFailed(!success)),
    [],
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
