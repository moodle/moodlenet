import * as moo from 'moodle-domain'

export type mailer = moo.DefService<{
  model: moo.DefModel<MailerModel>
  tokens: never
}>

export interface MailerModel {
  send: moo.Endpoint<['async', never]>
  configs: moo.StaticData<'w', never>
}
