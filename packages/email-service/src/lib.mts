import { sendEmail } from './emailSender/nodemailer/nodemailer.mjs'
import { env } from './init.mjs'
import type { EmailObj, SendResp } from './types.mjs'
import { kvStore } from './use-pkg-apis.mjs'

export async function send({ emailObj }: { emailObj: EmailObj }): Promise<SendResp> {
  const mailerCfg = env?.mailerCfg ?? (await kvStore.get('mailerCfg', '')).value
  // console.log({ mailerCfg })
  if (!mailerCfg) {
    console.log(emailObj)
    throw new Error(`no mailerCfg defined in env or kvstore ! can't send email !`)
  }
  const resp = await sendEmail(mailerCfg.transport, {
    from: mailerCfg.defaultFrom,
    replyTo: mailerCfg.defaultFrom,
    ...emailObj,
  })
  return resp
}
