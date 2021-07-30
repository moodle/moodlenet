import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectProfileHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { ActivationFormValues, ActivationProps } from '../Activation'

export const useActivationCtrl: CtrlHook<ActivationProps, { activationToken: string }> = ({ activationToken }) => {
  useRedirectProfileHomeIfLoggedIn({ delay: 618 })
  const { activateNewUser } = useSession()
  const [activationErrorMessage, setActivationErrorMessage] = useState<string | null>(null)
  const [accountActivated, setAccountActivated] = useState(false)
  const onSubmit = useCallback<SubmitForm<ActivationFormValues>>(
    ({ password, name }) =>
      activateNewUser({ password, name, activationToken }).then(err => {
        setActivationErrorMessage(err)
        setAccountActivated(!err)
      }),
    [activateNewUser, activationToken],
  )
  const formBag = useFormikBag<ActivationFormValues>({
    initialValues: { name: '', password: '' },
    onSubmit,
  })
  const activationProps = useMemo<ActivationProps>(() => {
    const activationProps: ActivationProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Activate User Access Header'),
      formBag,
      activationErrorMessage,
      accountActivated,
    }
    return activationProps
  }, [formBag, activationErrorMessage, accountActivated])

  return activationProps && [activationProps]
}
