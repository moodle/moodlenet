import { t } from '@lingui/macro'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { object, SchemaOf, string } from 'yup'
import { useSession } from '../../../../../../context/Global/Session'
import {
  mainPath,
  useRedirectProfileHomeIfLoggedIn,
} from '../../../../../../hooks/glob/nav'
import { href } from '../../../../../elements/link'
import { CtrlHook, ctrlHook } from '../../../../../lib/ctrl'
import { SubmitForm } from '../../../../../lib/formik'
import { useMainPageWrapperCtrl } from '../../../../templates/MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { LoginFormValues, LoginProps } from '../Login'

// const landingHref = href(mainPath.landing)

const validationSchema: SchemaOf<LoginFormValues> = object({
  email: string()
    .required(t`Please provide your email address`)
    .email(t`Please provide a valid email address`),
  password: string().required(t`Please provide a password`),
})

const recoverPasswordHref = href(mainPath.recoverPassword)
const signupHref = href(mainPath.signUp)
export const useLoginCtrl: CtrlHook<
  LoginProps,
  { activationEmailToken: Maybe<string> }
> = ({ activationEmailToken }) => {
  useRedirectProfileHomeIfLoggedIn()
  const { login } = useSession()
  const [wrongCreds, setWrongCreds] = useState(false)
  const onSubmit = useCallback<SubmitForm<LoginFormValues>>(
    ({ password, email }) =>
      login({ password, email, activationEmailToken }).then((resp) => {
        setWrongCreds(resp !== null)
      }),
    [login, activationEmailToken]
  )

  const form = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    onSubmit,
    validationSchema,
  })

  useEffect(() => {
    setWrongCreds(false)
  }, [form.values])

  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      accessHeaderProps: ctrlHook(
        useAccessHeaderCtrl,
        {},
        'Login Access Header'
      ),
      form,
      wrongCreds,
      // landingHref,
      signupHref,
      recoverPasswordHref,
      mainPageWrapperProps: ctrlHook(
        useMainPageWrapperCtrl,
        {},
        'main-page-wrapper'
      ),
    }
    return loginProps
  }, [form, wrongCreds])

  return loginProps && [loginProps]
}
