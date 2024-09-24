import { composeImpl, sec_factory } from '@moodle/lib-ddd'
import { iam } from './sec/moodle'
import { NodemailerSecEnv } from './types'

export function get_nodemailer_workers_factory(env: NodemailerSecEnv): sec_factory {
  return async function factory(ctx) {
    return composeImpl(await iam(env)(ctx))
  }
}
