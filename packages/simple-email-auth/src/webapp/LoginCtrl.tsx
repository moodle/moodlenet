import { AuthCtx } from '@moodlenet/react-app/web-lib.mjs'
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PanelProps } from './Login.js'
import { MainContext } from './MainComponent.js'
import * as LoginAddon from './Login.js'

export const usePanelProps = (): PanelProps => {
  const { pkgs } = useContext(MainContext)
  const [authPkgApis] = pkgs
  const [wrongCreds, setWrongCreds] = useState(false)
  const auth = useContext(AuthCtx)

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authPkgApis.call('login')({
        email,
        password,
      })

      if (!res.success) {
        setWrongCreds(true)
        return
      }
      setWrongCreds(false)
      auth.setSessionToken(res.sessionToken)
    },
    [auth, authPkgApis],
  )

  const panelProps = useMemo<PanelProps>(() => {
    const props: PanelProps = {
      login,
      wrongCreds,
    }

    return props
  }, [login, wrongCreds])

  return panelProps
}

export const LoginPanelCtrl: FC = () => {
  const panelProps = usePanelProps()

  return <LoginAddon.Panel {...panelProps} />
}
