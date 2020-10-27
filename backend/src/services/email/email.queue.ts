import { Job, Queue, QueueEvents, Worker } from 'bullmq'
import { UNNAMED_JOB } from '../../types/queue.types'
import { EmailQueueWorkers, SendEmailReq, SendEmailResult } from './email.queue.types'
const WORKERS_MODULE = process.env.EMAIL_IMPL // EmailServiceQueueWorkers implementatin module (without .js) relative from src/services/email/
const getWorkers = (): EmailQueueWorkers => {
  console.log('using cwrk', WORKERS_MODULE)
  return require(`./workers/${WORKERS_MODULE}`)
}
/**
 * SendEmailQ
 */
export const SEND_EMAIL_QNAME = 'email.send'
export const SEND_EMAIL_Q = new Queue(SEND_EMAIL_QNAME, {})
const queueEvents = new QueueEvents(SEND_EMAIL_QNAME, {})

export const consumeSendEmailQueue = () => {
  const workers = getWorkers()
  const consumer = new Worker(
    SEND_EMAIL_QNAME,
    async (job: Job<SendEmailReq, SendEmailResult>): Promise<SendEmailResult> => {
      console.log('new job', job.name, job.data)
      return workers.sendEmail(job.data.req)
    }
  )
  return consumer
}
export const enqueueEmail = (req: SendEmailReq, jobName = UNNAMED_JOB) =>
  SEND_EMAIL_Q.add(jobName, req)

queueEvents.on('completed', (jobRes) => {
  console.log('queueEvents.on completed', jobRes)
})
