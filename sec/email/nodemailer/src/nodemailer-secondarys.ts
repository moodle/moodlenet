import { NO_JOB_HERE } from '@moodle/domain/lib'
import { NodemailerSecEnv } from './types'

export function get_nodemailer_secondary_factory(_: NodemailerSecEnv): moo.def.model.impl {
  const modelImpl: moo.def.model.impl = {
    userHome: NO_JOB_HERE,
  }
  return modelImpl
}
