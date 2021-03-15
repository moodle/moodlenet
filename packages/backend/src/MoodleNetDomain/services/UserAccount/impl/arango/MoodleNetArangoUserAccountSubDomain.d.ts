import { Flow } from '../../../../../lib/domain/flow'
import { SubDomain } from '../../../../../lib/domain/types'
import { WrkDef } from '../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../../MoodleNetGraphQL'
import { UserSession } from '../../UserAccount.graphql.gen'
import { ActivationMessage, ActiveUserAccount, Messages } from './types'

export type MoodleNetArangoUserAccountSubDomain = SubDomain<
  MoodleNetDomain,
  'UserAccount',
  {
    RegisterNewAccount: {
      Request: WrkDef<
        (_: { email: string; flow: Flow }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      DeleteRequest: WrkDef<(_: { token: string }) => Promise<unknown>>
      ConfirmEmailActivateAccount: WrkDef<
        (_: {
          token: string
          password: string
          username: string
          flow: Flow
        }) => Promise<ActivationMessage | ActiveUserAccount>
      >
    }

    ChangeMainEmail: {
      Request: WrkDef<
        (_: {
          accountId: string
          newEmail: string
          flow: Flow
        }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      DeleteRequest: WrkDef<({ token }: { token: string }) => Promise<unknown>>
      ConfirmAndChangeAccountEmail: WrkDef<
        (_: { token: string; password: string; username: string }) => Promise<boolean>
      >
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
          ctx: MoodleNetExecutionContext
        }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      Create: WrkDef<
        (_: { username: string; password: string; ctx: MoodleNetExecutionContext }) => Promise<{ jwt: string | null }>
      >
      Get: WrkDef<(_: { username: string }) => Promise<UserSession | null>>
    }
  }
>
