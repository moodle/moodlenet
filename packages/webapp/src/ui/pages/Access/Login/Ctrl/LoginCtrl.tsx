import { useCallback, useMemo, useState } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../context/Global/Session'
import { mainPath, useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
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
  const { org: localOrg } = useLocalInstance()

  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      accessHeaderProps: {
        homeHref: href(mainPath.landing),
        organization: {
          name: localOrg.name,
          url: `//${localOrg.domain}`,
          logo: localOrg.icon,
        },
      },
      onSubmit,
      loginErrorMessage,
    }
    return loginProps
  }, [loginErrorMessage, onSubmit, localOrg])

  return loginProps && [loginProps]
}
