/**
 * Workers
 */
export interface EmailQueueWorkers {
  sendEmail(_: SendEmailObj): Promise<SendEmailResult>
}

/**
 * SendEmailJob
 */
export type SendEmailReq = {
  req: SendEmailObj
  cb?: CallCB
}
export type CallCB = string

export type SendEmailObj = {
  to: string[]
  from: string
  subject: string
} & (
  | {
      html?: undefined
      text: string
    }
  | {
      text?: undefined
      html: string
    }
)

export type SendEmailResultOK = {
  id: string
}
export type SendEmailResultKO = {
  error: string
}
export type SendEmailResult = SendEmailResultKO | SendEmailResultOK
export const isResultOk = (_: SendEmailResult): _ is SendEmailResultOK => 'id' in _
