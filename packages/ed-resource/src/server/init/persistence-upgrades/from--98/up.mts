import { addTextSearchFields } from '@moodlenet/system-entities/server'
import { Resource } from '../../sys-entities.mjs'

/* const inv_ind = await Resource.collection.index(TEXT_SEARCH_INDEX_NAME)
assert(inv_ind.type === 'inverted', inv_ind.type)
 */
await addTextSearchFields(Resource.collection.name, ['title', 'description'])

export default -97
