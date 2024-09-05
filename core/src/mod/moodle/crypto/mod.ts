import { __obfuscated__, map } from '@moodle/lib/types'
import { mod } from '../../../types'
import { JwtPayloadCustomClaims, JwtStdClaims, JwtToken } from './types/0_1'

export type module = mod<{
  V0_1: {
    sec: {
      pwdHash: {
        hash(_: { plainPwd: __obfuscated__<string> }): Promise<{ hashed: string }>
        match(_: {
          plainPwd: __obfuscated__<string>
          pwdHash: string
        }): Promise<{ matches: boolean }>
      }
      jwt: {
        sign(_: {
          jwtPayloadCustomClaims: JwtPayloadCustomClaims
          jwtStdClaims: JwtStdClaims
        }): Promise<{ jwt: string }>
        verify(_: { jwtToken: JwtToken }): Promise<{ payload: map | null }>
        decode(_: { jwtToken: JwtToken }): Promise<{ payload: map | null }>
      }
      ulid: {
        generate(_: { onDate: number | string }): Promise<{ ulid: string }>
      }
    }
    pri: never
    evt: never
  }
}>
