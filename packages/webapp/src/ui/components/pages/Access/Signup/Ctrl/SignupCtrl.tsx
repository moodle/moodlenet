import { t } from '@lingui/macro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { object, SchemaOf, string } from 'yup'
import { useSession } from '../../../../../../context/Global/Session'
import {
  mainPath,
  useRedirectHomeIfLoggedIn,
} from '../../../../../../hooks/glob/nav'
import { href } from '../../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../../lib/formik'
import { useMainPageWrapperCtrl } from '../../../../templates/MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { SignupFormValues, SignupProps } from '../Signup'

const validationSchema: SchemaOf<SignupFormValues> = object({
  name: string()
    .required(t`Please provide a display name`)
    .matches(
      /^[A-z0-9 ]+$/,
      t`Display name can contain only alphanumerics and spaces`
    ),
  email: string()
    .required(t`Please provide an email address`)
    .email(t`Please provide a valid email address`),
  password: string()
    .required(t`Please provide a password`)
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
  const [formik, formBag] = useFormikBag<SignupFormValues>({
    initialValues: { name: '', email: '', password: '' },
    validationSchema,
    onSubmit,
  })
  useEffect(() => {
    setSignupErrorMessage(null)
  }, [formik.values])

  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      accessHeaderProps: ctrlHook(
        useAccessHeaderCtrl,
        {},
        'Signup Access Header'
      ),
      formBag,
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
  }, [formBag, signupErrorMessage, requestSent])

  return signupProps && [signupProps]
}
