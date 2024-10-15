import { secondaryBootstrap } from '@moodle/domain'
import { mergeSecondaryAdapters } from '@moodle/domain/lib'
import { iam_secondary_factory } from './sec/moodle'
import { NodemailerSecEnv } from './types'

export function get_nodemailer_secondary_factory(env: NodemailerSecEnv): secondaryBootstrap {
  return bootstrapContext => {
    return secondaryContext => {
      return mergeSecondaryAdapters([iam_secondary_factory(env)(bootstrapContext)(secondaryContext)])
    }
  }
}
