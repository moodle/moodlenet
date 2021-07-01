import { t, Trans } from '@lingui/macro'
import { activateUserSchema } from '@moodlenet/common/lib/graphql/auth/validation/input/userAuth'
import { FC } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { boolean, object, ref, SchemaOf, string } from 'yup'
import { Href, Link } from '../../elements/link'
import { Submit, useFormikPlus } from '../../lib/formik'

export type ActivateNewUserPanelProps = {
  submit: Submit<ActivateNewUserFormValues>
  termsAndConditionsLink: Href
  message: string | null
  uiProp: 'red' | 'blue'
}
export type ActivateNewUserFormValues = {
  username: string
  password: string
  acceptTerms: boolean
  confirmPassword: string
}

export const ActivateNewUserPanel: FC<ActivateNewUserPanelProps> = ({
  submit,
  message,
  termsAndConditionsLink,
  uiProp,
}) => {
  const [form, inputAttrs] = useFormikPlus<ActivateNewUserFormValues>({
    initialValues: { acceptTerms: false, confirmPassword: '', password: '', username: '' },
    onSubmit: submit,
    validationSchema,
  })

  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          uiProp="{uiProp}"
          <br />
          <Trans>Please complete your subsription</Trans>
        </Header>
        <Form size="large" disabled={form.isSubmitting} onSubmit={form.submitForm}>
          <Segment stacked>
            <Form.Input
              {...inputAttrs.username}
              fluid
              placeholder={t`your user name`}
              onChange={form.handleChange}
              icon="user"
              iconPosition="left"
              error={
                form.errors.username && {
                  content: form.errors.username,
                  pointing: 'above',
                }
              }
            />
            <Form.Input
              {...inputAttrs.password}
              fluid
              placeholder={t`your password`}
              onChange={form.handleChange}
              icon="lock"
              iconPosition="left"
              type="password"
              error={
                form.errors.password && {
                  content: form.errors.password,
                  pointing: 'above',
                }
              }
            />
            <Form.Input
              {...inputAttrs.confirmPassword}
              fluid
              placeholder={t`confirm your password`}
              onChange={form.handleChange}
              icon="lock"
              iconPosition="left"
              type="password"
              error={
                form.errors.confirmPassword && {
                  content: form.errors.confirmPassword,
                  pointing: 'above',
                }
              }
            />
            <Form.Field
              {...inputAttrs.acceptTerms}
              label={
                <Trans>
                  I have read and agreed to the <Link href={termsAndConditionsLink}>Terms and Conditions</Link>
                </Trans>
              }
              onChange={form.handleChange}
              control="input"
              type="checkbox"
              error={
                form.errors.acceptTerms && {
                  content: form.errors.acceptTerms,
                  pointing: 'above',
                }
              }
            />
            <Button color="orange" size="large" type="submit">
              <Trans>Activate your user</Trans>
            </Button>
            {message && <Message negative header={t`Warning`} content={message} />}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  )
}

const validationSchema: SchemaOf<ActivateNewUserFormValues> = object({
  ...activateUserSchema.fields,
  confirmPassword: string()
    .oneOf([ref('password'), null], t`Passwords must match`)
    .required(),
  acceptTerms: boolean()
    .oneOf([true], t`Must Accept Terms and Conditions`)
    .required(),
})
