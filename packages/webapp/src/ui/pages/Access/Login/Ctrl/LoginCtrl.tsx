import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { defaultOrganization } from '../../../../lib/static-data'
import { LoginFormValues, LoginProps } from '../Login'

export const useLoginCtrl: CtrlHook<LoginProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { login } = useSession()
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<LoginFormValues>>(
    ({ password, username }) =>
      login({ password, username }).then(resp => {
        setLoginErrorMessage(resp)
      }),
    [login],
  )

  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      accessHeaderProps: {
        homeHref: href('Landing/Logged In'),
        organization: defaultOrganization,
      },
      onSubmit,
      loginErrorMessage,
    }
    return loginProps
  }, [loginErrorMessage, onSubmit])

  return loginProps && [loginProps]
}
