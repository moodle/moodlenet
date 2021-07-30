import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { mainPath, useRedirectProfileHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook, ctrlHook } from '../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { LoginFormValues, LoginProps } from '../Login'

const landingHref = href(mainPath.landing)
const signupHref = href(mainPath.signUp)
export const useLoginCtrl: CtrlHook<LoginProps, {}> = () => {
  useRedirectProfileHomeIfLoggedIn()
  const { login } = useSession()
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<LoginFormValues>>(
    ({ password, email }) =>
      login({ password, email }).then(resp => {
        setLoginErrorMessage(resp)
      }),
    [login],
  )
  const formBag = useFormikBag<LoginFormValues>({ initialValues: { email: '', password: '' }, onSubmit })
  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Login Access Header'),
      formBag,
      loginErrorMessage,
      landingHref,
      signupHref,
    }
    return loginProps
  }, [formBag, loginErrorMessage])

  return loginProps && [loginProps]
}
