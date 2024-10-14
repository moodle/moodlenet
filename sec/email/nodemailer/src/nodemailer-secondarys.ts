import { lib, secondaryBootstrap } from '@moodle/domain'
import { iam_secondary_factory } from './sec/moodle'
import { NodemailerSecEnv } from './types'

export function get_nodemailer_secondary_factory(env: NodemailerSecEnv): secondaryBootstrap {
  return bootstrapContext => {
    return secondaryContext => {
      return lib.mergeSecondaryAdapters([
        iam_secondary_factory(env)(bootstrapContext)(secondaryContext),
      ])
    }
  }
}
