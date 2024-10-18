import { secondaryBootstrap } from '@moodle/domain'
import { mergeSecondaryAdapters } from '@moodle/domain/lib'
import { user_notification_service_factory } from './sec'
import { NodemailerSecEnv } from './types'

export function get_nodemailer_secondary_factory(env: NodemailerSecEnv): secondaryBootstrap {
  return bootstrapContext => {
    return secondaryContext => {
      return mergeSecondaryAdapters([user_notification_service_factory(env)(bootstrapContext)(secondaryContext)])
    }
  }
}
