import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { LinkDef, useLink } from '../context'
import logo from '../static/img/moodlenet-logo.png'
import { FormBag } from '../types/types'

export type LoginFormValues = { username: string; password: string }
export type LoginPanelProps = {
  form: FormBag<LoginFormValues>
  message: string | null
  signupLink: LinkDef
}

export const LoginPanelBig: FC<LoginPanelProps> = ({ form, message, signupLink }) => {
  const Link = useLink()
  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          <Trans>Login to</Trans>
          <Header.Subheader>
            <Image src={logo} />
          </Header.Subheader>
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
            />
            <Form.Input
              fluid
              {...form.valueName.password}
              placeholder={t`your password`}
              onChange={form.handleChange}
              icon="lock"
              iconPosition="left"
              type="password"
            />
            <Button color="orange" fluid size="large" type="submit">
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
