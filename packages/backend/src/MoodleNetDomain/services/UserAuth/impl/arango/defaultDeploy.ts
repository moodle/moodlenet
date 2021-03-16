import { Config } from 'arangojs/connection'
import { DomainSetup, DomainStart } from '../../../../../lib/domain/types'
import { initMoodleNetGQLWrkService } from '../../../../MoodleNetGraphQL'
import { ConfirmEmailActivateUserWorker } from './apis/activateNewUser'
import { ChangeUserEmailRequestWorker } from './apis/changeMainEmailRequest'
import { ChangePasswordWorker } from './apis/changePassword'
import { ConfirmAndChangeUserEmailWorker } from './apis/confirmAndChangeUserEmail'
import { SessionCreateWorker } from './apis/createSession'
import { ChangeUserEmailDeleteRequestWorker } from './apis/deleteChangeMainEmailRequest'
import { RegisterNewUserDeleteRequestApiWorker } from './apis/deleteRegisterNewUserRequest'
import { SessionGetWorker } from './apis/getSession'
import { SessionByEmailWorker } from './apis/getSessionByEmail'
import { RegisterNewUserRequestWorker } from './apis/registerNewUserRequest'
import { userAuthGraphQLResolvers } from './graphql-resolvers'
import { MoodleNetArangoUserAuthSubDomain } from './MoodleNetArangoUserAuthSubDomain'
import { getPersistence } from './persistence'

export const defaultArangoUserAuthImpl: DomainSetup<MoodleNetArangoUserAuthSubDomain> = {
  'UserAuth.ChangeMainEmail.ConfirmAndChangeUserEmail': { kind: 'wrk' },
  'UserAuth.ChangeMainEmail.DeleteRequest': { kind: 'wrk' },
  'UserAuth.ChangeMainEmail.Request': { kind: 'wrk' },
  'UserAuth.ChangePassword': { kind: 'wrk' },
  'UserAuth.RegisterNewUser.ConfirmEmailActivateUser': { kind: 'wrk' },
  'UserAuth.RegisterNewUser.DeleteRequest': { kind: 'wrk' },
  'UserAuth.RegisterNewUser.Request': { kind: 'wrk' },
  'UserAuth.Session.ByEmail': { kind: 'wrk' },
  'UserAuth.Session.Create': { kind: 'wrk' },
  'UserAuth.Session.Get': { kind: 'wrk' },
  'UserAuth.GQL': { kind: 'wrk' },
}

export const defaultArangoUserAuthStartServices = ({
  dbCfg,
  databaseName,
}: {
  dbCfg: Config
  databaseName: string
}) => {
  const _getPersistence = () => getPersistence({ cfg: dbCfg, databaseName })
  const moodleNetArangoUserAuthSubDomainStart: DomainStart<MoodleNetArangoUserAuthSubDomain> = {
    'UserAuth.ChangeMainEmail.ConfirmAndChangeUserEmail': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ConfirmAndChangeUserEmailWorker({ persistence }), teardown]
      },
    },
    'UserAuth.ChangeMainEmail.DeleteRequest': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ChangeUserEmailDeleteRequestWorker({ persistence }), teardown]
      },
    },
    'UserAuth.ChangeMainEmail.Request': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ChangeUserEmailRequestWorker({ persistence }), teardown]
      },
    },
    'UserAuth.ChangePassword': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ChangePasswordWorker({ persistence }), teardown]
      },
    },
    'UserAuth.RegisterNewUser.ConfirmEmailActivateUser': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [ConfirmEmailActivateUserWorker({ persistence }), teardown]
      },
    },
    'UserAuth.RegisterNewUser.DeleteRequest': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [RegisterNewUserDeleteRequestApiWorker({ persistence }), teardown]
      },
    },
    'UserAuth.RegisterNewUser.Request': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [RegisterNewUserRequestWorker({ persistence }), teardown]
      },
    },
    'UserAuth.Session.ByEmail': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [SessionByEmailWorker({ persistence }), teardown]
      },
    },
    'UserAuth.Session.Create': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [SessionCreateWorker({ persistence }), teardown]
      },
    },
    'UserAuth.Session.Get': {
      init: async () => {
        const [persistence, teardown] = await _getPersistence()
        return [SessionGetWorker({ persistence }), teardown]
      },
    },
    'UserAuth.GQL': {
      init: initMoodleNetGQLWrkService({
        srvName: 'UserAuth',
        executableSchemaDef: { resolvers: userAuthGraphQLResolvers },
      }),
    },
  }
  return moodleNetArangoUserAuthSubDomainStart
}
