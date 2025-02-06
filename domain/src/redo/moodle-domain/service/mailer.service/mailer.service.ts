export type mailer = moo.service<{
  model: moo.model<MailerModel>
  tokens: never
}>

export type MailerModel = {
  send: moo.model.type.endpoint<['async', unknown, unknown]>
  configs: moo.model.type.staticData<'w', never>
}
