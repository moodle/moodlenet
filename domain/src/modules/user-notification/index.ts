import { ok_ko } from '@moodle/lib-types'
import { userNotification } from './types'
export default interface UserNotificationDomain {
  event: { userNotification: unknown }
  primary: {
    userNotification: {
      service?: unknown
    }
  }
  secondary: {
    userNotification: {
      write?: unknown
      sync?: unknown
      query?: unknown
      service: {
        enqueueNotificationToUser<userNotificationType extends userNotification>(_: {
          data: userNotificationType
        }): Promise<ok_ko<void, { userNotFound: unknown; unknownNotification: unknown }>>
      }
    }
  }
}
