import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import { IscedField, Language } from '../../sys-entities.mjs'

await shell.initiateCall(async () => {
  await setPkgCurrentUser()

  await IscedField.collection.ensureIndex({
    type: 'persistent',
    name: 'popularity',
    fields: ['popularity.overall'],
  })
  await IscedField.collection.ensureIndex({
    type: 'persistent',
    name: 'published',
    fields: ['published'],
  })
  await Language.collection.ensureIndex({
    type: 'persistent',
    name: 'published',
    fields: ['published'],
  })
})

export default 4
