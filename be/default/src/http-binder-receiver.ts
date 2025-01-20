import { http_bind } from '@moodle/bindings-http'

const MOODLE_HTTP_BINDER_RECEIVER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_RECEIVER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_RECEIVER_BASEURL = process.env.MOODLE_HTTP_BINDER_RECEIVER_BASEURL ?? '/'

export async function httpBinderReceiverProvider() {
  const { binderReceiver, drain } = await http_bind.getHttpBinderReceiver({
    port: MOODLE_HTTP_BINDER_RECEIVER_PORT,
    basePath: MOODLE_HTTP_BINDER_RECEIVER_BASEURL,
  })
  return {
    binderReceiver,
    drain,
  }
}
