import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { ActivationFormValues, ActivationProps } from '../Activation'

export const useActivationCtrl: CtrlHook<ActivationProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { activation } = useSession()
  const [activationErrorMessage, setActivationErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<ActivationFormValues>>(
    ({ password, displayName }) =>
      activation({ password, displayName }).then(resp => {
        setActivationErrorMessage(resp)
      }),
    [activation],
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
