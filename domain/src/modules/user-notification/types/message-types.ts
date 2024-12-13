import { d_u, pretty } from '@moodle/lib-types'
import { userAccountNotifications } from '../../user-account'

export type userNotification = d_u<
  {
    userAccount: d_u<userAccountNotifications, 'type'>
    __REMOVE_ME_LATER_WHEN_THERE_ARE_MORE_MODULES_KEEP_IT_HERE_NOW_TO_ENSURE_TYPINGS_WORKS_WITH_MULTIPLE_MODULES__: d_u<
      { __TEST__: { __TEST__: Date }; __TEST2__: { __TEST2__: number } },
      'type'
    >
  },
  'module'
>
export type userNotificationType = userNotification extends infer k
  ? k extends userNotification
    ? pretty<Pick<k, 'module' | 'type'>>
    : never
  : never
