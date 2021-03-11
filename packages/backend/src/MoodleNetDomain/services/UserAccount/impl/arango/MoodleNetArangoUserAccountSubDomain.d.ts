import { Event } from '../../../../../lib/domain/event'
import { Flow } from '../../../../../lib/domain/flow'
import { SubDomain } from '../../../../../lib/domain/types'
import { WrkDef } from '../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../../MoodleNetGraphQL'
import { User } from '../../../ContentGraph/ContentGraph.graphql.gen'
import { ShallowNode } from '../../../ContentGraph/types.node'
import { UserSession } from '../../UserAccount.graphql.gen'
import { ActivationMessage, ActiveUserAccount } from './types'

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
        }) => Promise<ActivationMessage | { account: ActiveUserAccount; user: ShallowNode<User> }>
      >
      NewAccountActivated: Event<{
        accountId: string
        username: string
      }>
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
      AccountEmailChanged: Event<{
        accountId: string
        newEmail: string
        oldEmail: string
      }>
      ConfirmAndChangeAccountEmail: WrkDef<
        (_: { token: string; password: string; username: string }) => Promise<boolean>
      >
    }

    ChangePassword: WrkDef<
      (_: {
        username: string
        currentPassword: string
        newPassword: string
      }) => Promise<{ success: true } | { success: false; reason: string }>
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
