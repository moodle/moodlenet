import { d_u, pretty } from '@moodle/lib-types'
import { userAccountMessages } from '../../user-account'

export type userMessage = d_u<
  {
    userAccount: d_u<userAccountMessages, 'type'>
    __REMOVE_ME_LATER_WHEN_THERE_ARE_MORE_MODULES_KEEP_IT_HERE_NOW_TO_ENSURE_TYPINGS_WORKS_WITH_MULTIPLE_MODULES__: d_u<
      { __TEST__: { __TEST__: Date }; __TEST2__: { __TEST2__: number } },
      'type'
    >
  },
  'module'
>
export type userMessageType = userMessage extends infer k
  ? k extends userMessage
    ? pretty<Pick<k, 'module' | 'type'>>
    : never
  : never
