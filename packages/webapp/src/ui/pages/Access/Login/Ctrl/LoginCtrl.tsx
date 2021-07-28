import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { CtrlHook, ctrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { LoginFormValues, LoginProps } from '../Login'

export const useLoginCtrl: CtrlHook<LoginProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { login } = useSession()
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<LoginFormValues>>(
    ({ password, email }) =>
      login({ password, email }).then(resp => {
        setLoginErrorMessage(resp)
      }),
    [login],
  )
  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Login Access Header'),
      onSubmit,
      loginErrorMessage,
    }
    return loginProps
  }, [loginErrorMessage, onSubmit])

  return loginProps && [loginProps]
}
