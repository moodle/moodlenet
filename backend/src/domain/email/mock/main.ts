import { Workers } from '@mn-be/domain/email'

export type Cfg = {}
export type Opts = {}

export const makeWorkers = ({}: Cfg, {}: Opts): Workers => {
  const sendEmail: Workers['sendEmail'] = async (req) =>
    Math.random() < 0.5
      ? { error: `error sendEmail: ${req.subject}` }
      : { id: `${req.subject}:${Math.random()}` }

  return {
    sendEmail,
  }
}
