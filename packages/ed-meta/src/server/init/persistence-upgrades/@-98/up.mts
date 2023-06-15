import { addTextSearchFields } from '@moodlenet/system-entities/server'
import { IscedField } from '../../sys-entities.mjs'

await addTextSearchFields(IscedField.collection.name, ['name', 'codePath'])

export default -97
