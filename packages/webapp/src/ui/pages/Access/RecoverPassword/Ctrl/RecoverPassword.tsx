export { };
/*import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { mainPath, useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { RecoverPasswordFormValues, RecoverPasswordProps } from '../RecoverPassword'
const landingHref = href(mainPath.landing)
const loginHref = href(mainPath.login)
export const useRecoverPasswordCtrl: CtrlHook<RecoverPasswordProps, {}> = () => {
  useRedirectHomeIfLoggedIn()
  const { RecoverPassword } = useSession()
  const [RecoverPasswordErrorMessage, setRecoverPasswordErrorMessage] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const onSubmit = useCallback<SubmitForm<RecoverPasswordFormValues>>(
    ({ email }) =>
      RecoverPassword({ email }).then(_resp => {
        setRecoverPasswordErrorMessage(_resp)
        setRequestSent(_resp === null)
      }),
    [RecoverPassword],
  )
  const [formik, formBag] = useFormikBag<RecoverPasswordFormValues>({ initialValues: { email: '' }, onSubmit })
  useEffect(() => {
    setRecoverPasswordErrorMessage(null)
  }, [formik.values])

  const RecoverPasswordProps = useMemo<RecoverPasswordProps>(() => {
    const RecoverPasswordProps: RecoverPasswordProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'RecoverPassword Access Header'),
      formBag,
      RecoverPasswordErrorMessage,
      requestSent,
      landingHref,
      loginHref,
    }
    return RecoverPasswordProps
  }, [formBag, RecoverPasswordErrorMessage, requestSent])

  return RecoverPasswordProps && [RecoverPasswordProps]
}
*/