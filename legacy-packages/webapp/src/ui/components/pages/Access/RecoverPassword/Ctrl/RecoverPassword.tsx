import { t } from '@lingui/macro'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { object, SchemaOf, string } from 'yup'
import { useSession } from '../../../../../../context/Global/Session'
import {
  mainPath,
  useRedirectHomeIfLoggedIn,
} from '../../../../../../hooks/glob/nav'
import { href } from '../../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { SubmitForm } from '../../../../../lib/formik'
import { useMainPageWrapperCtrl } from '../../../../templates/MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import {
  RecoverPasswordFormValues,
  RecoverPasswordProps,
} from '../RecoverPassword'
const landingHref = href(mainPath.landing)
const loginHref = href(mainPath.login)
const validationSchema: SchemaOf<RecoverPasswordFormValues> = object({
  email: string()
    .required(t`Please provide an email address`)
    .email(t`Please provide a valid email address`),
})
export const useRecoverPasswordCtrl: CtrlHook<
  RecoverPasswordProps,
  {}
> = () => {
  useRedirectHomeIfLoggedIn()
  const { recoverPassword } = useSession()
  const [RecoverPasswordErrorMessage, setRecoverPasswordErrorMessage] =
    useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const onSubmit = useCallback<SubmitForm<RecoverPasswordFormValues>>(
    ({ email }) =>
      recoverPassword({ email }).then((_resp) => {
        setRecoverPasswordErrorMessage(_resp)
        setRequestSent(_resp === null)
      }),
    [recoverPassword]
  )
  const form = useFormik<RecoverPasswordFormValues>({
    initialValues: { email: '' },
    onSubmit,
    validationSchema,
  })
  useEffect(() => {
    setRecoverPasswordErrorMessage(null)
  }, [form.values])

  const RecoverPasswordProps = useMemo<RecoverPasswordProps>(() => {
    const RecoverPasswordProps: RecoverPasswordProps = {
      accessHeaderProps: ctrlHook(
        useAccessHeaderCtrl,
        {},
        'Recover Password Access Header'
      ),
      form,
      RecoverPasswordErrorMessage,
      requestSent,
      landingHref,
      loginHref,
      mainPageWrapperProps: ctrlHook(
        useMainPageWrapperCtrl,
        {},
        'main-page-wrapper'
      ),
    }
    return RecoverPasswordProps
  }, [form, RecoverPasswordErrorMessage, requestSent])

  return RecoverPasswordProps && [RecoverPasswordProps]
}
