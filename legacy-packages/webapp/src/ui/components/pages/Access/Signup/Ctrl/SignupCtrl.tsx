import { t } from '@lingui/macro'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { object, SchemaOf, string } from 'yup'
import { useSession } from '../../../../../../context/Global/Session'
import {
  mainPath,
  useRedirectHomeIfLoggedIn,
} from '../../../../../../hooks/glob/nav'
import { href } from '../../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { SubmitForm } from '../../../../../lib/formik'
import { useMainPageWrapperCtrl } from '../../../../templates/MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { SignupFormValues, SignupProps } from '../Signup'

const validationSchema: SchemaOf<SignupFormValues> = object({
  name: string()
    .max(30)
    .min(3)
    .required(t`Please provide a display name`),
  /* .matches(
      /^[\p{L}\p{M}\p{N}\p{Zs}]+$/u,
      t`Display name can contain only unicode alphanumerics and spaces`
    ) */ email: string()
    .required(t`Please provide an email address`)
    .email(t`Please provide a valid email address`),
  password: string()
    .required(t`Please provide a password`)
    .max(30)
    .min(6, 'Password is too short should be 6 chars minimum.'),
})

const landingHref = href(mainPath.landing)
const loginHref = href(mainPath.login)
const userAgreementHref = href(mainPath.userAgreement)
export const useSignupCtrl: CtrlHook<SignupProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { signUp } = useSession()
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(
    null
  )
  const [requestSent, setRequestSent] = useState(false)
  const onSubmit = useCallback<SubmitForm<SignupFormValues>>(
    ({ email, name, password }) =>
      signUp({ email, name, password }).then((_resp) => {
        setSignupErrorMessage(_resp)
        setRequestSent(_resp === null)
      }),
    [signUp]
  )
  const form = useFormik<SignupFormValues>({
    initialValues: { name: '', email: '', password: '' },
    validationSchema,
    onSubmit,
  })
  useEffect(() => {
    setSignupErrorMessage(null)
  }, [form.values])

  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      accessHeaderProps: ctrlHook(
        useAccessHeaderCtrl,
        {},
        'Signup Access Header'
      ),
      form,
      signupErrorMessage,
      requestSent,
      landingHref,
      loginHref,
      userAgreementHref,
      mainPageWrapperProps: ctrlHook(
        useMainPageWrapperCtrl,
        {},
        'main-page-wrapper'
      ),
    }
    return signupProps
  }, [form, signupErrorMessage, requestSent])

  return signupProps && [signupProps]
}
