import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { ShallowNodeByType } from '../../graphql/types.node'
import { subjectFields } from '../../initialData/ISCED/Fields/SubjectFields'
import getInitialUsers from '../../initialData/user-auth/initialUsers'
// import { DefaultConfig } from '../../initialData/user-auth/defaultConfig'
import { SystemSessionEnv } from '../../lib/auth/env'
import { QMCommand, QMino } from '../../lib/qmino/lib'
import { create } from '../content-graph/node'
import { createNewUser } from '../user-auth/new-user'

export const initialContent = QMCommand(({ domain }: { domain: string }) => async ({ qmino }: { qmino: QMino }) => {
  console.log(`creating psudo users`)
  const initialUsers = await Promise.all(
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
  const subjFields = await Promise.all(subjectFields.map(insertSubjectField))

  // TODO:
  // console.log(`inserting default config`)
  // const saveDefaultConfigAction = saveConfig({ config: DefaultConfig })
  // const userAuthCfg = await qmino.callSync(saveConfig, { timeout: 5000 })

  return { subjFields, initialUsers /*,userAuthCfg */ }

  function insertSubjectField(subj_field: ShallowNodeByType<'SubjectField'>) {
    const { _key } = parseNodeId(subj_field.id)
    const action = create({ data: subj_field, env: SystemSessionEnv(), nodeType: 'SubjectField', key: _key })
    return qmino.callSync(action, { timeout: 5000 })
  }
})
/*
qmino: command::@moodlenet/backend::0.0.1::setup::initialContent##[{"domain":"moodlenet.dev"}]
*/
