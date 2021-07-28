import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectProfileHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { ActivationFormValues, ActivationProps } from '../Activation'

export const useActivationCtrl: CtrlHook<ActivationProps, { activationToken: string }> = ({ activationToken }) => {
  useRedirectProfileHomeIfLoggedIn()
  const { activateNewUser } = useSession()
  const [activationErrorMessage, setActivationErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<ActivationFormValues>>(
    ({ password, name }) =>
      activateNewUser({ password, name, activationToken }).then(resp => {
        setActivationErrorMessage(resp)
      }),
    [activateNewUser, activationToken],
  )

  const activationProps = useMemo<ActivationProps>(() => {
    const activationProps: ActivationProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Activate User Access Header'),
      onSubmit,
      activationErrorMessage,
    }
    return activationProps
  }, [activationErrorMessage, onSubmit])

  return activationProps && [activationProps]
}
