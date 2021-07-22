import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { defaultOrganization } from '../../../../lib/static-data'
import { ActivationFormValues, ActivationProps } from '../Activation'

export const useActivationCtrl: CtrlHook<ActivationProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { activation } = useSession()
  const [activationErrorMessage, setActivationErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<ActivationFormValues>>(
    ({ email, username }) =>
    activation({ email, username }).then(resp => {
        setActivationErrorMessage(resp)
      }),
    [activation],
  )

  const activationProps = useMemo<ActivationProps>(() => {
    const activationProps: ActivationProps = {
      accessHeaderProps: {
        homeHref: href('Landing/Logged In'),
        organization: defaultOrganization,
      },
      onSubmit,
      activationErrorMessage,
      requestSent
    }
    return activationProps
  }, [activationErrorMessage, onSubmit])

  return activationProps && [activationProps]
}
