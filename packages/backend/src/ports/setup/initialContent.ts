import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { ShallowNodeByType } from '../../graphql/types.node'
import { subjectFields } from '../../initialData/ISCED/Fields/SubjectFields'
import { DefaultConfig } from '../../initialData/user-auth/defaultConfig'
import getInitialUsers from '../../initialData/user-auth/initialUsers'
// import { DefaultConfig } from '../../initialData/user-auth/defaultConfig'
import { SystemSessionEnv } from '../../lib/auth/env'
import { QMCommand, QMino } from '../../lib/qmino/lib'
import { create } from '../content-graph/node'
import * as userAuthConfigPorts from '../user-auth/config'
import { createNewUser } from '../user-auth/new-user'

export const initialContent = QMCommand(({ domain }: { domain: string }) => async ({ qmino }: { qmino: QMino }) => {
  console.log(`initialContent for domain:${domain}`)

  console.log(`inserting default UserAuth Config`)
  const saveDefaultConfigAction = userAuthConfigPorts.save({ cfg: DefaultConfig, sessionEnv: SystemSessionEnv() })
  const saveCfgRes = await qmino.callSync(saveDefaultConfigAction, { timeout: 5000 })
  if (!saveCfgRes) {
    throw new Error('could not save default UserAuth Config')
  }

  console.log(`creating pseudo users`)
  /* const initialUsers = */ await Promise.all(
    getInitialUsers({ domain }).map(async userData => {
      const createUserAction = createNewUser(userData)
      const user_or_err = await qmino.callSync(createUserAction, { timeout: 5000 })
      if (!user_or_err || typeof user_or_err === 'string') {
        throw new Error(`insert initial user ${userData.username} Result: ${user_or_err}`)
      }
      const user = user_or_err
      return user
    }),
  )

  console.log(`creating subjectFields`)
  /* const subjFields = */ await Promise.all(subjectFields.map(insertSubjectField))

  return null //{ subjFields, initialUsers /*,userAuthCfg */ }

  function insertSubjectField(subj_field: ShallowNodeByType<'SubjectField'>) {
    const { _key } = parseNodeId(subj_field.id)
    const action = create({ data: subj_field, env: SystemSessionEnv(), nodeType: 'SubjectField', key: _key })
    return qmino.callSync(action, { timeout: 5000 })
  }
})
/*
qmino: command::@moodlenet/backend::0.0.1::setup::initialContent##[{"domain":"moodlenet.dev"}]
*/
