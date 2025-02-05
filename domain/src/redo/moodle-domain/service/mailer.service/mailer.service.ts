import * as moo from 'moodle-domain'

export type mailer = moo.DefService<{
  model: moo.DefModel<MailerModel>
  tokens: never
}>

export type MailerModel = {
  send: moo.Endpoint<['async', unknown, unknown]>
  configs: moo.StaticData<'w', never>
}
