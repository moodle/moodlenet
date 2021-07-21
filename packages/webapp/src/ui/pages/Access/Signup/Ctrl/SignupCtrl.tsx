import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { defaultOrganization } from '../../../../lib/static-data'
import { SignupFormValues, SignupProps } from '../Signup'

export const useSignupCtrl: CtrlHook<SignupProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { signup } = useSession()
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<SignupFormValues>>(
    ({ email, username }) =>
    signup({ email, username }).then(resp => {
        setSignupErrorMessage(resp)
      }),
    [signup],
  )

  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      accessHeaderProps: {
        homeHref: href('Landing/Logged In'),
        organization: defaultOrganization,
      },
      onSubmit,
      signupErrorMessage,
      requestSent
    }
    return signupProps
  }, [signupErrorMessage, onSubmit])

  return signupProps && [signupProps]
}
