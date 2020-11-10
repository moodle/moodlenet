import { getMNQJobMeta } from '../../lib/queue'
import { MNQJobMeta } from '../../lib/queue/types'
import { sendEmailWF } from './email.queues'
import { persistence, sender } from './email.service.env'
import { SendEmailJobReq } from './types'
import { EmailService } from './types/service'

const emailService: EmailService = {
  name: 'email',
  actions: {},
  created() {
    const sendEmail = async (_: { mail: SendEmailJobReq; job: MNQJobMeta }) => {
      const sendRes = await sender.sendEmail(_.mail)
      const recordId = await persistence.storeSentEmail({ res: sendRes, req: _.mail, job: _.job })
      return {
        sendRes,
        recordId,
      }
    }
    sendEmailWF.consume(async (job, progress) => {
      const { sendRes } = await sendEmail({ mail: job.json, job: getMNQJobMeta(job) })
      progress(job, sendRes)
    })
  },
}
module.exports = emailService
export default emailService
