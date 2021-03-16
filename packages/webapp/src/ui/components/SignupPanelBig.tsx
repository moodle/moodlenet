import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Form, Grid, Header, Icon, Image, Message, Segment } from 'semantic-ui-react'
import { LinkDef, useLink } from '../context'
import logo from '../static/img/moodlenet-logo.png'
import { FormBag, UseProps } from '../types'

export type SignupFormValues = { email: string }
export type SignupPanelProps = {
  useProps: UseSignupPanelProps
}
export type UseSignupPanelProps = UseProps<{
  form: FormBag<SignupFormValues>
  warnMessage: string | null
  homeLink: LinkDef
  signUpSucceded: boolean
}>

export const SignupPanelBig: FC<SignupPanelProps> = ({ useProps }) => {
  const Link = useLink()
  const { form, warnMessage, homeLink, signUpSucceded } = useProps()
  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          <Trans>Signup to</Trans>
          <Header.Subheader>
            <Link href={homeLink}>
              <Image src={logo} size="big" centered />
            </Link>
          </Header.Subheader>
        </Header>
        {signUpSucceded ? (
          <Message>
            <Message.Header>
              <Icon name="check circle outline" size="big" />
              <Trans>Thank you for registering</Trans>
            </Message.Header>
            <Message.Content>
              <Trans>You will soon receive an email with an activation link to complete your registration</Trans>
            </Message.Content>
          </Message>
        ) : (
          <Form size="large" disabled={form.isSubmitting} onSubmit={form.submitForm}>
            <Segment stacked>
              <Form.Input
                fluid
                {...form.valueName.email}
                placeholder={t`your email`}
                onChange={form.handleChange}
                icon="user"
                iconPosition="left"
                error={
                  form.errors.email && {
                    content: form.errors.email,
                    pointing: 'below',
                  }
                }
              />
              <Button color="orange" fluid size="large" type="submit">
                <Trans>Signup</Trans>
              </Button>
              {warnMessage && <Message negative header={t`Warning`} content={warnMessage} />}
            </Segment>
          </Form>
        )}
      </Grid.Column>
    </Grid>
  )
}
