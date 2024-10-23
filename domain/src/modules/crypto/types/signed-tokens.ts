import { d_u } from '@moodle/lib-types'
import { userAccountSignTokenData } from '../../user-account'

export type signedToken = d_u<
  {
    userAccount: d_u<userAccountSignTokenData, 'type'>
    __REMOVE_ME__: d_u<{ __TEST__: { __TEST__: Date }; __TEST2__: { __TEST2__: number } }, 'type'>
  },
  'module'
>
export type signedTokenType = signedToken extends infer k
  ? k extends signedToken
    ? Pick<k, 'module' | 'type'>
    : never
  : never

export type signedTokenOf<type extends signedTokenType> = signedToken & type
