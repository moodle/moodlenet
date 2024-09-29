import { composeDomains, sec_factory } from '@moodle/lib-ddd'
import { iam } from './sec/moodle'
import { NodemailerSecEnv } from './types'

export function get_nodemailer_secondarys_factory(env: NodemailerSecEnv): sec_factory {
  return async function factory(ctx) {
    return composeDomains(await iam(env)(ctx))
  }
}
