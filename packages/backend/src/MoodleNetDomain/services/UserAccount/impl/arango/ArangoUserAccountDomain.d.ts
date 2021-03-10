import { Event } from '../../../../../lib/domain/event'
import { Flow } from '../../../../../lib/domain/flow'
import { SubDomain } from '../../../../../lib/domain/impl'
import { Wrk } from '../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../../MoodleNetGraphQL'
import { User } from '../../../ContentGraph/ContentGraph.graphql.gen'
import { ShallowNode } from '../../../ContentGraph/types.node'
import { UserSession } from '../../UserAccount.graphql.gen'
import { ActivationMessage, ActiveUserAccount } from './types'

export type ArangoUserAccountSubDomain = SubDomain<
  MoodleNetDomain,
  'UserAccount',
  {
    RegisterNewAccount: {
      Request: Wrk<
        (_: { email: string; flow: Flow }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      DeleteRequest: Wrk<(_: { token: string }) => Promise<unknown>>
      ConfirmEmailActivateAccount: Wrk<
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
      Request: Wrk<
        (_: {
          accountId: string
          newEmail: string
          flow: Flow
        }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      DeleteRequest: Wrk<({ token }: { token: string }) => Promise<unknown>>
      AccountEmailChanged: Event<{
        accountId: string
        newEmail: string
        oldEmail: string
      }>
      ConfirmAndChangeAccountEmail: Wrk<(_: { token: string; password: string; username: string }) => Promise<boolean>>
    }

    ChangePassword: Wrk<
      (_: {
        username: string
        currentPassword: string
        newPassword: string
      }) => Promise<{ success: true } | { success: false; reason: string }>
    >

    Session: {
      ByEmail: Wrk<
        (_: {
          email: string
          username: string
          flow: Flow
          ctx: MoodleNetExecutionContext
        }) => Promise<{ success: true } | { success: false; reason: string }>
      >
      Create: Wrk<
        (_: { username: string; password: string; ctx: MoodleNetExecutionContext }) => Promise<{ jwt: string | null }>
      >
      Get: Wrk<(_: { username: string }) => Promise<UserSession | null>>
    }
  }
>
