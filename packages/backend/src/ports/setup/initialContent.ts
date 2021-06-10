import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { ShallowNodeByType } from '../../graphql/types.node'
import { subjectFields } from '../../initialData/ISCED/Fields/SubjectFields'
import { DefaultAdminUser } from '../../initialData/user-auth/defaultAdmin'
// import { DefaultConfig } from '../../initialData/user-auth/defaultConfig'
import { SystemSessionEnv } from '../../lib/auth/env'
import { QMCommand, QMino } from '../../lib/qmino/lib'
import { create } from '../content-graph/node'
import { createNewUser } from '../user-auth/new-user'

export const initialContent = QMCommand(() => async ({ qmino }: { qmino: QMino }) => {
  console.log(`creating default Admin`)
  const createAdminAction = createNewUser(DefaultAdminUser())
  const admin = await qmino.callSync(createAdminAction, { timeout: 5000 })
  if (!admin || typeof admin === 'string') {
    throw new Error(`insert default Admin Error: ${admin}`)
  }

  console.log(`creating subjectFields`)
  const subjFields = await Promise.all(subjectFields.map(insertSubjectField))

  // TODO:
  // console.log(`inserting default config`)
  // const saveDefaultConfigAction = saveConfig({ config: DefaultConfig })
  // const userAuthCfg = await qmino.callSync(saveConfig, { timeout: 5000 })

  return { admin, subjFields /*,userAuthCfg */ }

  function insertSubjectField(subj_field: ShallowNodeByType<'SubjectField'>) {
    const { _key } = parseNodeId(subj_field.id)
    const action = create({ data: subj_field, env: SystemSessionEnv(), nodeType: 'SubjectField', key: _key })
    return qmino.callSync(action, { timeout: 5000 })
  }
})
/*
qmino: command::@moodlenet/backend::0.0.1::setup::initialContent##
*/
