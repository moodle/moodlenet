import { Maybe } from '@moodlenet/common/lib/utils/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { mainPath, useRedirectProfileHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook, ctrlHook } from '../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { LoginFormValues, LoginProps } from '../Login'

// const landingHref = href(mainPath.landing)
const recoverPasswordHref = href(mainPath.recoverPassword)
const signupHref = href(mainPath.signUp)
export const useLoginCtrl: CtrlHook<LoginProps, { activationEmailToken: Maybe<string> }> = () => {
  useRedirectProfileHomeIfLoggedIn()
  const { login } = useSession()
  const [wrongCreds, setWrongCreds] = useState(false)
  const onSubmit = useCallback<SubmitForm<LoginFormValues>>(
    ({ password, email, activationEmailToken }) =>
      login({ password, email, activationEmailToken }).then(resp => {
        setWrongCreds(resp !== null)
      }),
    [login],
  )

  const [formik, formBag] = useFormikBag<LoginFormValues>({ initialValues: { email: '', password: '' }, onSubmit })

  useEffect(() => {
    setWrongCreds(false)
  }, [formik.values])

  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Login Access Header'),
      formBag,
      wrongCreds,
      // landingHref,
      signupHref,
      recoverPasswordHref,
    }
    return loginProps
  }, [formBag, wrongCreds])

  return loginProps && [loginProps]
}
