import { AuthCtx } from '@moodlenet/react-app/web-lib.mjs'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { PanelProps } from './Login.js'
import { MainContext } from './MainComponent.js'
import * as LoginAddon from './Login.js'
import { useFormik } from 'formik'

// TODO : METTERE FORMIK qui

export const usePanelProps = (): PanelProps => {
  const { pkgs } = useContext(MainContext)
  const [authPkgApis] = pkgs
  const [wrongCreds, setWrongCreds] = useState(false)
  const auth = useContext(AuthCtx)

  const form = useFormik<LoginAddon.LoginFormValues>({
    initialValues: { email: '', password: '' },
    async onSubmit({ email, password }) {
      login(email, password)
      /*
      setWrongCreds(false)
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
      */
    },
  })

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
      wrongCreds,
      form,
    }

    return props
  }, [form, wrongCreds])

  return panelProps
}

export const LoginPanelCtrl: FC = () => {
  const panelProps = usePanelProps()

  return <LoginAddon.Panel {...panelProps} />
}
