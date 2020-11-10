import { EmailSenderImpl } from '../../../types'

const sendEmail: EmailSenderImpl['sendEmail'] = async (_req) =>
  Math.random() > 0.5
    ? {
        _state: 'SendEmailProgressKO',
        error: `mock Error`,
      }
    : {
        _state: 'SendEmailProgressOK',
        id: `mock id`,
      }
const mockImpl: EmailSenderImpl = {
  sendEmail,
}

module.exports = mockImpl
export default mockImpl
