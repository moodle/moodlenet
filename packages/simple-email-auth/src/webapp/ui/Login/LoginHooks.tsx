import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { shell } from '../../shell.mjs'
import type { LoginFormValues, LoginProps } from './Login.js'

export const usePanelProps = (): LoginProps => {
  const [wrongCreds, setWrongCreds] = useState(false)
  // const auth = useContext(AuthCtx)

  const form = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    async onSubmit({ email, password }) {
      const res = await shell.rpc.me.login({
        email,
        password,
      })

      if (!res.success) {
        setWrongCreds(true)
        return
      }

      setWrongCreds(false)
      // auth.setSessionToken(res.sessionToken)
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
