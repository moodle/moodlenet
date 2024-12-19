import { http_bind } from '@moodle/bindings-http'
import { binderReceiverProvider } from './types'

const MOODLE_HTTP_BINDER_RECEIVER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_RECEIVER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_RECEIVER_BASEURL = process.env.MOODLE_HTTP_BINDER_RECEIVER_BASEURL ?? '/'

const default_binder_receiver_provider: binderReceiverProvider = async () => {
  const { binderReceiver, drain } = await http_bind.getHttpBinderReceiver({
    port: MOODLE_HTTP_BINDER_RECEIVER_PORT,
    basePath: MOODLE_HTTP_BINDER_RECEIVER_BASEURL,
  })
  return {
    binderReceiver,
    drain,
  }
}
export default default_binder_receiver_provider
