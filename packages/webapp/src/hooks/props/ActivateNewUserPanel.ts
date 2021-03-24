import { t } from '@lingui/macro'
import { activateUser } from '@moodlenet/common/lib/graphql/validation/input/userAuth'
import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { TermsAndConditions } from '@moodlenet/common/src/webapp/sitemap/routes'
import { useEffect, useState } from 'react'
import { boolean, object, ref, SchemaOf, string } from 'yup'
import { useSession } from '../../contexts/Global/Session'
import { MutationActivateUserArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { ActivateNewUserFormValues, ActivateNewUserPanelProps } from '../../ui/pages/ActivateNewUser'

const termsAndConditionsLink = webappPath<TermsAndConditions>('/terms', {})
type FormValues = ActivateNewUserFormValues & MutationActivateUserArgs

export const useActivateNewUserPanelProps = ({ token }: { token: string }): ActivateNewUserPanelProps => {
  const { activateNewUser } = useSession()
  const [message, setMessage] = useState<string | null>(null)
  const [, form] = useFormikWithBag<FormValues>({
    initialValues: { username: '', confirmPassword: '', password: '', acceptTerms: false, token },
    validationSchema,
    validateOnChange: false,
    onSubmit({ username, password, token }) {
      return activateNewUser({ token, username, password }).then(setMessage)
    },
  })

  useEffect(() => {
    activateUser.fields.token.validate(token).catch(() => setMessage('invalid page url'))
  }, [token])

  return { termsAndConditionsLink, form, message }
}

const validationSchema: SchemaOf<FormValues> = object({
  ...activateUser.fields,
  confirmPassword: string()
    .oneOf([ref('password'), null], t`Passwords must match`)
    .required(),
  acceptTerms: boolean()
    .oneOf([true], t`Must Accept Terms and Conditions`)
    .required(),
})
