import { addTextSearchFields } from '@moodlenet/system-entities/server'
import { Profile } from '../../sys-entities.mjs'

await addTextSearchFields(Profile.collection.name, ['displayName', 'aboutMe'])

export default -95
