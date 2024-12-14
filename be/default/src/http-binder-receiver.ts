import { http_bind } from '@moodle/bindings-node'
import { binderReceiver } from '@moodle/domain'

const MOODLE_HTTP_BINDER_RECEIVER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_RECEIVER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_RECEIVER_BASEURL = process.env.MOODLE_HTTP_BINDER_RECEIVER_BASEURL ?? '/'

const default_binder_receiver: binderReceiver = http_bind.getHttpBinderReceiver({
  port: MOODLE_HTTP_BINDER_RECEIVER_PORT,
  basePath: MOODLE_HTTP_BINDER_RECEIVER_BASEURL,
})
export default default_binder_receiver
