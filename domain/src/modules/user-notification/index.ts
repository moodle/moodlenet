import { ok_ko } from '@moodle/lib-types'
import { userNotification } from './types'
export default interface UserNotificationDomain {
  event: unknown
  primary: unknown
  secondary: {
    userNotification: {
      queue: unknown
      write: unknown
      sync: unknown
      query: unknown
      service: {
        enqueueNotificationToUser<userNotificationType extends userNotification>(_: {
          data: userNotificationType
        }): Promise<ok_ko<void, { userNotFound: unknown }>>
      }
    }
  }
}
