import { t } from '@lingui/macro'
import { activateAccount } from '@moodlenet/common/lib/graphql/validation/input/user-account'
import { TermsAndConditions } from '@moodlenet/common/src/webapp/sitemap/routes'
import { FC, useEffect, useState } from 'react'
import { boolean, object, ref, SchemaOf, string } from 'yup'
import { MutationActivateAccountArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { webappLinkDef } from '../../helpers/navigation'
import { ActivateAccountFormValues, ActivateAccountPanel } from '../../ui/pages/ActivateNewAccount'
import { useActivateNewAccountMutation } from './ActivateNewAccountPanel/activateNewAccount.gen'

export type ActivateNewAccountPanelProps = { token: string }
type FormValues = ActivateAccountFormValues & MutationActivateAccountArgs
const termsAndConditionsLink = webappLinkDef<TermsAndConditions>('/terms', {})
export const ActivateNewAccountPanelCtrl: FC<ActivateNewAccountPanelProps> = ({ token }) => {
  const [activateNewAccount, result] = useActivateNewAccountMutation()
  const [message, setMessage] = useState<string>()
  const [, bag] = useFormikWithBag<FormValues>({
    initialValues: { username: '', confirmPassword: '', password: '', acceptTerms: false, token },
    validationSchema,
    validateOnChange: false,
    onSubmit({ username, password, token }) {
      return activateNewAccount({ variables: { token, username, password } }).then(({ errors }) => {
        setMessage(errors?.map(_ => _.message).join('\n'))
      })
    },
  })
  useEffect(() => {
    activateAccount.fields.token.validate(token).catch(() => setMessage('invalid page url'))
  }, [token])
  return (
    <ActivateAccountPanel
      termsAndConditionsLink={termsAndConditionsLink}
      form={bag}
      message={result.data?.activateAccount.message || message}
    />
  )
}
const validationSchema: SchemaOf<FormValues> = object({
  ...activateAccount.fields,
  confirmPassword: string()
    .oneOf([ref('password'), null], t`Passwords must match`)
    .required(),
  acceptTerms: boolean()
    .oneOf([true], t`Must Accept Terms and Conditions`)
    .required(),
})
