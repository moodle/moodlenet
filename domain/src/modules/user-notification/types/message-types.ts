import { d_u } from '@moodle/lib-types'
import { userAccountNotifications } from '../../user-account'
export type enqueueFailDetails = unknown

export type userNotification = d_u<
  {
    userAccount: d_u<userAccountNotifications, 'type'>
    __REMOVE_ME__: d_u<{ __TEST__: { __TEST__: Date }; __TEST2__: { __TEST2__: number } }, 'type'>
  },
  'module'
>
export type userNotificationType = userNotification extends infer k
  ? k extends userNotification
    ? Pick<k, 'module' | 'type'>
    : never
  : never

export type userNotificationOf<type extends userNotificationType> = userNotification & type
