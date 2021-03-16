import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { LinkDef, useLink } from '../context'
import { FormBag, UseProps } from '../types'

export type ActivateNewAccountPanelProps = {
  useProps: UseActivateNewAccountPanelProps
}
export type UseActivateNewAccountPanelProps = UseProps<{
  form: FormBag<ActivateNewAccountFormValues>
  termsAndConditionsLink: LinkDef
  message: string | null
}>
export type ActivateNewAccountFormValues = {
  username: string
  password: string
  acceptTerms: boolean
  confirmPassword: string
}

export const ActivateNewAccountPanel: FC<ActivateNewAccountPanelProps> = ({ useProps }) => {
  const Link = useLink()
  const { form, message, termsAndConditionsLink } = useProps()
  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          <Trans>Please complete your subsription</Trans>
        </Header>
        <Form size="large" disabled={form.isSubmitting} onSubmit={form.submitForm}>
          <Segment stacked>
            <Form.Input
              fluid
              {...form.valueName.username}
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
              fluid
              {...form.valueName.password}
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
              fluid
              {...form.valueName.confirmPassword}
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
              label={
                <Trans>
                  I have read and agreed to the <Link href={termsAndConditionsLink}>Terms and Conditions</Link>
                </Trans>
              }
              {...form.valueName.acceptTerms}
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
            <Button color="orange" fluid size="large" type="submit">
              <Trans>Activate your account</Trans>
            </Button>
            {message && <Message negative header={t`Warning`} content={message} />}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  )
}
