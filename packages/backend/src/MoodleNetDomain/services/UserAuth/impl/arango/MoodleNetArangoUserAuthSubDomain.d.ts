import { Flow } from '../../../../../lib/domain/flow'
import { SubDomain } from '../../../../../lib/domain/types'
import { WrkDef } from '../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { UserSession } from '../../UserAuth.graphql.gen'
import { ActivationMessage, ActiveUser, Messages } from './types'

export type MoodleNetArangoUserAuthSubDomain = SubDomain<
  MoodleNetDomain,
  'UserAuth',
  {
    RegisterNewUser: {
      Request: WrkDef<
        (_: { email: string; flow: Flow }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      DeleteRequest: WrkDef<(_: { token: string }) => Promise<unknown>>
      ConfirmEmailActivateUser: WrkDef<
        (_: {
          token: string
          password: string
          username: string
          flow: Flow
        }) => Promise<ActivationMessage | ActiveUser>
      >
    }

    ChangeMainEmail: {
      Request: WrkDef<
        (_: {
          userId: string
          newEmail: string
          flow: Flow
        }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      DeleteRequest: WrkDef<({ token }: { token: string }) => Promise<unknown>>
      ConfirmAndChangeUserEmail: WrkDef<(_: { token: string; password: string; username: string }) => Promise<boolean>>
    }

    ChangePassword: WrkDef<
      (_: { username: string; currentPassword: string; newPassword: string }) => Promise<Messages.NotFound | null>
    >

    Session: {
      ByEmail: WrkDef<
        (_: {
          email: string
          username: string
          flow: Flow
        }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      Create: WrkDef<(_: { username: string; password: string }) => Promise<{ jwt: string | null }>>
      Get: WrkDef<(_: { username: string }) => Promise<UserSession | null>>
    }
  }
>
