import { Trans, t } from '@lingui/macro'
import { FC } from 'react'
import { FormBag } from '../types/types'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import logo from '../static/img/moodlenet-logo.png'

export type SignupFormValues = { email: string }
export type SignupPanelProps = {
  form: FormBag<SignupFormValues>
  message: string | null
}

export const SignupPanelBig: FC<SignupPanelProps> = ({ form, message }) => {
  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          <Trans>Signup to</Trans>
          <Header.Subheader>
            <Image src={logo} size="medium" centered />
          </Header.Subheader>
        </Header>
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
            {message && <Message negative header={t`Warning`} content={message} />}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  )
}
