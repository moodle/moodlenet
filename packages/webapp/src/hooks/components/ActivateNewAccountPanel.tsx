import { t } from '@lingui/macro'
import { activateAccount } from '@moodlenet/common/lib/graphql/validation/input/user-account'
import { TermsAndConditions } from '@moodlenet/common/src/webapp/sitemap/routes'
import { useEffect, useState } from 'react'
import { boolean, object, ref, SchemaOf, string } from 'yup'
import { useSession } from '../../contexts/Global/Session'
import { MutationActivateAccountArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { webappLinkDef } from '../../helpers/navigation'
import { ActivateNewAccountFormValues, UseActivateNewAccountPanelProps } from '../../ui/pages/ActivateNewAccount'

const termsAndConditionsLink = webappLinkDef<TermsAndConditions>('/terms', {})
type FormValues = ActivateNewAccountFormValues & MutationActivateAccountArgs

export const getUseActivateNewAccountPanelProps = ({ token }: { token: string }): UseActivateNewAccountPanelProps =>
  function useActivateNewAccountPanelProps() {
    const { activateNewAccount } = useSession()
    const [message, setMessage] = useState<string | null>(null)
    const [, form] = useFormikWithBag<FormValues>({
      initialValues: { username: '', confirmPassword: '', password: '', acceptTerms: false, token },
      validationSchema,
      validateOnChange: false,
      onSubmit({ username, password, token }) {
        return activateNewAccount({ token, username, password }).then(setMessage)
      },
    })

    const _token = token
    useEffect(() => {
      activateAccount.fields.token.validate(token).catch(() => setMessage('invalid page url'))
    }, [_token])

    return { termsAndConditionsLink, form, message }
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
