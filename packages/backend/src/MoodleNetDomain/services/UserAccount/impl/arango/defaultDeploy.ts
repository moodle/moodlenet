import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { initMoodleNetGQLWrkService } from '../../../../MoodleNetGraphQL'
import { ConfirmEmailActivateAccountWorker } from './apis/activateNewAccount'
import { ChangeAccountEmailRequestWorker } from './apis/changeMainEmailRequest'
import { ChangePasswordWorker } from './apis/changePassword'
import { ConfirmAndChangeAccountEmailWorker } from './apis/confirmAndChangeAccountEmail'
import { SessionCreateWorker } from './apis/createSession'
import { ChangeAccountEmailDeleteRequestWorker } from './apis/deleteChangeMainEmailRequest'
import { RegisterNewAccountDeleteRequestApiWorker } from './apis/deleteRegisterNewAccountRequest'
import { SessionGetWorker } from './apis/getSession'
import { SessionByEmailWorker } from './apis/getSessionByEmail'
import { RegisterNewAccountRequestWorker } from './apis/registerNewAccountRequest'
import { userAccountGraphQLResolvers } from './graphql-resolvers'
import { MoodleNetArangoUserAccountSubDomain } from './MoodleNetArangoUserAccountSubDomain'
import { getPersistence } from './persistence'

export const defaultArangoUserAccountImpl: DomainSetup<MoodleNetArangoUserAccountSubDomain> = {
  'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail': { kind: 'wrk' },
  'UserAccount.ChangeMainEmail.DeleteRequest': { kind: 'wrk' },
  'UserAccount.ChangeMainEmail.Request': { kind: 'wrk' },
  'UserAccount.ChangePassword': { kind: 'wrk' },
  'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount': { kind: 'wrk' },
  'UserAccount.RegisterNewAccount.DeleteRequest': { kind: 'wrk' },
  'UserAccount.RegisterNewAccount.Request': { kind: 'wrk' },
  'UserAccount.Session.ByEmail': { kind: 'wrk' },
  'UserAccount.Session.Create': { kind: 'wrk' },
  'UserAccount.Session.Get': { kind: 'wrk' },
  'UserAccount.GQL': { kind: 'wrk' },
}

export const defaultArangoUserAccountStartServices = ({
  dbCfg,
  databaseName,
}: {
  dbCfg: Config
  databaseName: string
}) => {
  const _getPersistence = () => getPersistence({ cfg: dbCfg, databaseName })
  const moodleNetArangoUserAccountSubDomainStart: DomainStart<MoodleNetArangoUserAccountSubDomain> = {
    'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ConfirmAndChangeAccountEmailWorker({ persistence }), teardown]
      },
    },
    'UserAccount.ChangeMainEmail.DeleteRequest': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ChangeAccountEmailDeleteRequestWorker({ persistence }), teardown]
      },
    },
    'UserAccount.ChangeMainEmail.Request': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ChangeAccountEmailRequestWorker({ persistence }), teardown]
      },
    },
    'UserAccount.ChangePassword': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ChangePasswordWorker({ persistence }), teardown]
      },
    },
    'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ConfirmEmailActivateAccountWorker({ persistence }), teardown]
      },
    },
    'UserAccount.RegisterNewAccount.DeleteRequest': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [RegisterNewAccountDeleteRequestApiWorker({ persistence }), teardown]
      },
    },
    'UserAccount.RegisterNewAccount.Request': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [RegisterNewAccountRequestWorker({ persistence }), teardown]
      },
    },
    'UserAccount.Session.ByEmail': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [SessionByEmailWorker({ persistence }), teardown]
      },
    },
    'UserAccount.Session.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [SessionCreateWorker({ persistence }), teardown]
      },
    },
    'UserAccount.Session.Get': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [SessionGetWorker({ persistence }), teardown]
      },
    },
    'UserAccount.GQL': {
      init: initMoodleNetGQLWrkService({
        srvName: 'UserAccount',
        executableSchemaDef: { resolvers: userAccountGraphQLResolvers },
      }),
    },
  }
  return moodleNetArangoUserAccountSubDomainStart
}
