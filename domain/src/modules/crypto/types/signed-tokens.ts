import { d_u, pretty } from '@moodle/lib-types'
import { userAccountSignTokenData } from '../../user-account'

export type signedToken = d_u<
  {
    userAccount: d_u<userAccountSignTokenData, 'type'>
    __REMOVE_ME_LATER_WHEN_THERE_ARE_MORE_MODULES_KEEP_IT_HERE_NOW_TO_ENSURE_TYPINGS_WORKS_WITH_MULTIPLE_MODULES__: d_u<
      { __TEST__: { __TEST__: Date }; __TEST2__: { __TEST2__: number } },
      'type'
    >
  },
  'module'
>
export type signedTokenType = signedToken extends infer k
  ? k extends signedToken
    ? pretty<Pick<k, 'module' | 'type'>>
    : never
  : never

export type signedTokenOf<type extends signedTokenType> = signedToken & type
