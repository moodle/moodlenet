import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { createWithProps } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { LoginFormValues, LoginProps } from '../Login'

export const [LoginCtrl, loginWithProps] = createWithProps<LoginProps, {}>(props => {
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
    const { __key, __uiComp, ...rest } = props

    const loginProps: LoginProps = {
      ...rest,
      accessHeaderProps: {
        organization: {
          name: 'BFH',
          url: 'https://www.bfh.ch/',
          logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
        },
      },
      onSubmit,
      loginErrorMessage,
    }
    return loginProps
  }, [loginErrorMessage, onSubmit, props])

  const { __uiComp: LoginUI } = props

  return <LoginUI {...loginProps} />
})
