import { http_bind } from '@moodle/bindings-node'

import { binder } from './types'

const MOODLE_HTTP_BINDER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_BASEURL = process.env.MOODLE_HTTP_BINDER_BASEURL ?? '/'

const default_binder: binder = ({ messageDispatcher }) => {
  return http_bind.server({
    port: MOODLE_HTTP_BINDER_PORT,
    basePath: MOODLE_HTTP_BINDER_BASEURL,
    messageDispatcher,
  })
}
export default default_binder
