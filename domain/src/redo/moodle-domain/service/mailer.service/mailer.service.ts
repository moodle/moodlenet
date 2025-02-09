export type mailer = moo.service<{
  model: moo.model<MailerModel>
}>

type srvTypes = moo.ucServiceTypes<'mailer'>

export type MailerModel = {
  send: {
    [persona in keyof srvTypes]: {
      [ctx in keyof srvTypes[persona]]: {
        [scope in keyof srvTypes[persona][ctx]]: {
          [uc in keyof srvTypes[persona][ctx][scope]]: {
            [eml in keyof srvTypes[persona][ctx][scope][uc]]: moo.model.type.endpoint<
              ['async', { data: srvTypes[persona][ctx][scope][uc][eml] }, unknown]
            >
          }
        }
      }
    }
  }
  configs: moo.model.type.staticData<'w', never>
}
