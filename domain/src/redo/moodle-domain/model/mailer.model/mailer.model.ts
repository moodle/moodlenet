export type mailer = moo.model<MailerModel>

type modelUcTypes = moo.ucModelUcTypes<'mailer'>

export type MailerModel = {
  send: {
    [persona in keyof modelUcTypes]: {
      [ctx in keyof modelUcTypes[persona]]: {
        [scope in keyof modelUcTypes[persona][ctx]]: {
          [uc in keyof modelUcTypes[persona][ctx][scope]]: {
            [eml in keyof modelUcTypes[persona][ctx][scope][uc]]: moo.model.type.endpoint<
              ['async', { data: modelUcTypes[persona][ctx][scope][uc][eml] }, unknown]
            >
          }
        }
      }
    }
  }
  configs: moo.model.type.staticData<'w', never>
}
