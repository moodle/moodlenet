export { };
/* import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectProfileHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { NewPasswordFormValues, NewPasswordProps } from '../NewPassword'

export const useNewPasswordCtrl: CtrlHook<NewPasswordProps, { newPasswordToken: string }> = ({ newPasswordToken }) => {
  useRedirectProfileHomeIfLoggedIn({ delay: 618 })
  const { activateNewUser } = useSession()
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState<string | null>(null)
  const [accountActivated, setAccountActivated] = useState(false)
  const onSubmit = useCallback<SubmitForm<NewPasswordFormValues>>(
    ({ password, name }) =>
      activateNewUser({ password, name, newPasswordToken }).then(err => {
        setNewPasswordErrorMessage(err)
        setAccountActivated(!err)
      }),
    [activateNewUser, newPasswordToken],
  )
  const [, formBag] = useFormikBag<NewPasswordFormValues>({
    initialValues: { name: '', password: '' },
    onSubmit,
  })
  const newPasswordProps = useMemo<NewPasswordProps>(() => {
    const newPasswordProps: NewPasswordProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Activate User Access Header'),
      formBag,
      newPasswordErrorMessage,
      accountActivated,
    }
    return newPasswordProps
  }, [formBag, newPasswordErrorMessage, accountActivated])

  return newPasswordProps && [newPasswordProps]
}
 */