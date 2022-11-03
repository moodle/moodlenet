import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { useContext, useMemo, useState } from 'react'
import { LoginFormValues, LoginProps } from './Login.js'
import { MainContext } from '../MainComponent.js'
import { useFormik } from 'formik'

export const usePanelProps = (): LoginProps => {
  const { pkgs } = useContext(MainContext)
  const [authPkgApis] = pkgs
  const [wrongCreds, setWrongCreds] = useState(false)
  const auth = useContext(AuthCtx)

  const form = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    async onSubmit({ email, password }) {
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
  })

  const panelProps = useMemo<LoginProps>(() => {
    const props: LoginProps = {
      form,
      wrongCreds,
    }

    return props
  }, [form, wrongCreds])

  return panelProps
}
