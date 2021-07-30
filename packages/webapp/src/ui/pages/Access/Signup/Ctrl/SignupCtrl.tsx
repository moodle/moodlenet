import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { mainPath, useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { SignupFormValues, SignupProps } from '../Signup'
const landingHref = href(mainPath.landing)
const loginHref = href(mainPath.login)
export const useSignupCtrl: CtrlHook<SignupProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { signUp } = useSession()
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const onSubmit = useCallback<SubmitForm<SignupFormValues>>(
    ({ email }) =>
      signUp({ email }).then(_resp => {
        setSignupErrorMessage(_resp)
        setRequestSent(_resp === null)
      }),
    [signUp],
  )
  const formBag = useFormikBag<SignupFormValues>({ initialValues: { email: '' }, onSubmit })
  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Signup Access Header'),
      formBag,
      signupErrorMessage,
      requestSent,
      landingHref,
      loginHref,
    }
    return signupProps
  }, [formBag, signupErrorMessage, requestSent])

  return signupProps && [signupProps]
}
