import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Link } from '../elements/link'
import logo from '../static/img/moodlenet-logo.png'
import { FormBag } from '../types'

export type LoginPanelProps = {
  form: FormBag<LoginFormValues>
  message: string | null
  signupLink: string
  homeLink: string
}
export type LoginFormValues = { username: string; password: string }

export const LoginPanelBig: FC<LoginPanelProps> = ({ form, message, signupLink, homeLink }) => {
  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          <Trans>Login to</Trans>
          <Header.Subheader>
            <Link href={homeLink}>
              <Image src={logo} size="big" centered />
            </Link>
          </Header.Subheader>
        </Header>
        <Form size="large" disabled={form.isSubmitting} onSubmit={form.submitForm}>
          <Segment stacked>
            <Form.Input
              fluid
              {...form.inputAttrs.username}
              placeholder={t`your user name`}
              onChange={form.handleChange}
              icon="user"
              iconPosition="left"
            />
            <Form.Input
              fluid
              {...form.inputAttrs.password}
              placeholder={t`your password`}
              onChange={form.handleChange}
              icon="lock"
              iconPosition="left"
              type="password"
            />
            <Button color="orange" size="large" type="submit">
              <Trans>Login</Trans>
            </Button>
            {message && <Message negative header={t`Warning`} content={message} />}
          </Segment>
        </Form>
        <Message>
          <Trans>
            New to us? <Link href={signupLink}>Sign Up</Link>
          </Trans>
        </Message>
      </Grid.Column>
    </Grid>
  )
}
