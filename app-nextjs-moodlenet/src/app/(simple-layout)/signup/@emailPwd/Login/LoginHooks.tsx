import { href } from '@moodlenet/react-app/common'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { RECOVER_PASSWORD_PATH } from '../../../../../../../zz__legacy/packages/simple-email-auth/src/common/webapp-routes.mjs'
import { shell } from '../../../../../../../zz__legacy/packages/simple-email-auth/src/webapp/shell.mjs'
import type { LoginFormValues, LoginProps } from './Login.jsx'

export const usePanelProps = (): LoginProps => {
  const [wrongCreds, setWrongCreds] = useState(false)
  // const auth = useContext(AuthCtx)

  const form = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    async onSubmit({ email, password }) {
      const res = await shell.rpc.me('login')({
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
      recoverPasswordHref: href(RECOVER_PASSWORD_PATH),
    }

    return props
  }, [form, wrongCreds])

  return panelProps
}
