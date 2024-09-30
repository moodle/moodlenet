import { moodle_domain, moodle_secondary_factory } from '@moodle/domain'
import { composeDomains } from '@moodle/lib-ddd'
import { iam_moodle_secondary_factory } from './sec/moodle'
import { NodemailerSecEnv } from './types'

export function get_nodemailer_secondary_factory(env: NodemailerSecEnv): moodle_secondary_factory {
  return ctx => {
    return composeDomains<moodle_domain>([iam_moodle_secondary_factory(env)(ctx)])
  }
}
