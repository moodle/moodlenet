import { StartServices } from '../../../../../lib/domain/amqp/start'
import { DomainImpl } from '../../../../../lib/domain/impl'
import { initMoodleNetGQLWrkService } from '../../../../MoodleNetGraphQL'
import { ConfirmEmailActivateAccountApiWrkInit } from './apis/activateNewAccount'
import { ChangeAccountEmailRequestHandler } from './apis/changeMainEmailRequest'
import { ChangePasswordApiWrkInit } from './apis/changePassword'
import { ConfirmAndChangeAccountEmailWrkInit } from './apis/confirmAndChangeAccountEmail'
import { SessionCreateWrkInit } from './apis/createSession'
import { ChangeAccountEmailDeleteRequestApiWrkInit } from './apis/deleteChangeMainEmailRequest'
import { RegisterNewAccountDeleteRequestApiWrkInit } from './apis/deleteRegisterNewAccountRequest'
import { SessionGetWrkInit } from './apis/getSession'
import { SessionByEmailWrkInit } from './apis/getSessionByEmail'
import { RegisterNewAccountRequestWrkInit } from './apis/registerNewAccountRequest'
import { userAccountGraphQLResolvers } from './graphql-resolvers'
import { MoodleNetArangoUserAccountSubDomain } from './MoodleNetArangoUserAccountSubDomain'

export const defaultArangoUserAccountImpl: DomainImpl<MoodleNetArangoUserAccountSubDomain> = {
  'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail': {
    kind: 'wrk',
    init: ConfirmAndChangeAccountEmailWrkInit,
  },
  'UserAccount.ChangeMainEmail.DeleteRequest': {
    kind: 'wrk',
    init: ChangeAccountEmailDeleteRequestApiWrkInit,
  },
  'UserAccount.ChangeMainEmail.Request': {
    kind: 'wrk',
    init: ChangeAccountEmailRequestHandler,
  },
  'UserAccount.ChangePassword': {
    kind: 'wrk',
    init: ChangePasswordApiWrkInit,
  },
  'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount': {
    kind: 'wrk',
    init: ConfirmEmailActivateAccountApiWrkInit,
  },
  'UserAccount.RegisterNewAccount.DeleteRequest': {
    kind: 'wrk',
    init: RegisterNewAccountDeleteRequestApiWrkInit,
  },
  'UserAccount.RegisterNewAccount.Request': {
    kind: 'wrk',
    init: RegisterNewAccountRequestWrkInit,
  },
  'UserAccount.Session.ByEmail': {
    kind: 'wrk',
    init: SessionByEmailWrkInit,
  },
  'UserAccount.Session.Create': {
    kind: 'wrk',
    init: SessionCreateWrkInit,
  },
  'UserAccount.Session.Get': {
    kind: 'wrk',
    init: SessionGetWrkInit,
  },
  'UserAccount.GQL': initMoodleNetGQLWrkService({
    srvName: 'UserAccount',
    executableSchemaDef: { resolvers: userAccountGraphQLResolvers },
  }),
}

export const defaultArangoUserAccountStartServices: StartServices<MoodleNetArangoUserAccountSubDomain> = {
  'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail': {},
  'UserAccount.ChangeMainEmail.DeleteRequest': {},
  'UserAccount.ChangeMainEmail.Request': {},
  'UserAccount.ChangePassword': {},
  'UserAccount.GQL': {},
  'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount': {},
  'UserAccount.RegisterNewAccount.DeleteRequest': {},
  'UserAccount.RegisterNewAccount.Request': {},
  'UserAccount.Session.ByEmail': {},
  'UserAccount.Session.Create': {},
  'UserAccount.Session.Get': {},
}
