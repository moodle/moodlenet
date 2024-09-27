import { access_session, domain_msg } from '@moodle/lib-ddd'

export interface TransportData {
  domain_msg: domain_msg
  access_session: access_session
}
