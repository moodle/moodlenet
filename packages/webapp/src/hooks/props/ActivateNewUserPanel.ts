import { t } from '@lingui/macro'
import { activateUserSchema } from '@moodlenet/common/lib/graphql/auth/validation/input/userAuth'
import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { TermsAndConditions } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useEffect, useState } from 'react'
import { boolean, object, ref, SchemaOf, string } from 'yup'
import { useSession } from '../../context/Global/Session'
import { MutationActivateUserArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { href } from '../../ui/elements/link'
import { ActivateNewUserFormValues } from '../../ui/pages/ActivateNewUser/ActivateNewUser'

const termsAndConditionsLink = href(webappPath<TermsAndConditions>('/terms', {}))
type FormValues = ActivateNewUserFormValues & MutationActivateUserArgs

export const useActivateNewUserPanelProps = ({ token }: { token: string })=> {
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
    activateUserSchema.fields.token.validate(token).catch(() => setMessage('invalid page url'))
  }, [token])

  return { termsAndConditionsLink, message,submit: form. }
}

const validationSchema: SchemaOf<FormValues> = object({
  ...activateUserSchema.fields,
  confirmPassword: string()
    .oneOf([ref('password'), null], t`Passwords must match`)
    .required(),
  acceptTerms: boolean()
    .oneOf([true], t`Must Accept Terms and Conditions`)
    .required(),
})
