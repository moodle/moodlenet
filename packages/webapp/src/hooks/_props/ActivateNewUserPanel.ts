import { t } from '@lingui/macro'
import { activateUserSchema } from '@moodlenet/common/lib/graphql/auth/validation/input/userAuth'
import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { TermsAndConditions } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useEffect, useState } from 'react'
import { boolean, object, ref, SchemaOf, string } from 'yup'
import { useSession } from '../../packages/webapp/src/context/Global/Session'
import { MutationActivateUserArgs } from '../../packages/webapp/src/graphql/pub.graphql.link'
import { useFormikWithBag } from '../../packages/webapp/src/helpers/forms'
import { href } from '../../packages/webapp/src/ui/elements/link'
import { ActivateNewUserFormValues } from '../../packages/webapp/src/ui/pages/ActivateNewUser/ActivateNewUser'

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
