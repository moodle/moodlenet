import { useCallback, useMemo, useState } from 'react'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { SignupFormValues, SignupProps } from '../Signup'

const signup = async (..._a: any[]) => null as any
export const useSignupCtrl: CtrlHook<SignupProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  // const { signup } = useSession()
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const onSubmit = useCallback<SubmitForm<SignupFormValues>>(
    ({ email }) =>
      signup({ email }).then(
        _resp => {
          setRequestSent(true)
        },
        err => {
          setSignupErrorMessage(String(err))
        },
      ),
    [],
  )

  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Signup Access Header'),
      onSubmit,
      signupErrorMessage,
      requestSent,
    }
    return signupProps
  }, [onSubmit, signupErrorMessage, requestSent])

  return signupProps && [signupProps]
}
