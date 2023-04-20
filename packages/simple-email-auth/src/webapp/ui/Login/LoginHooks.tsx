import { useFormik } from 'formik'
import { useContext, useMemo, useState } from 'react'
import { MainContext } from '../../MainContext.mjs'
import { LoginFormValues, LoginProps } from './Login.js'

export const usePanelProps = (): LoginProps => {
  const {
    use: { me },
  } = useContext(MainContext)

  const [wrongCreds, setWrongCreds] = useState(false)
  // const auth = useContext(AuthCtx)

  const form = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    async onSubmit({ email, password }) {
      const res = await me.rpc.login({
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
