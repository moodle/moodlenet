import { http_bind } from '@moodle/bindings-node'

import { Binder } from './types'

const MOODLE_HTTP_BINDER_PORT = parseInt(process.env.MOODLE_HTTP_BINDER_PORT ?? '8000')
const MOODLE_HTTP_BINDER_BASEURL = process.env.MOODLE_HTTP_BINDER_BASEURL ?? '/'

const default_binder: Binder = ({ domain_session_access }) => {
  return http_bind.server({
    port: MOODLE_HTTP_BINDER_PORT,
    baseUrl: MOODLE_HTTP_BINDER_BASEURL,
    domain_session_access: domain_session_access,
  })
}
export default default_binder
