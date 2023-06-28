import { addTextSearchFields } from '@moodlenet/system-entities/server'
import { Resource } from '../../sys-entities.mjs'

// export const TEXT_SEARCH_INDEX_NAME = 'text_search'
// await Resource.collection.ensureIndex({
//   name: TEXT_SEARCH_INDEX_NAME,
//   type: 'inverted',
//   fields: ['title', 'description'],
//   analyzer: 'text_en',
//   searchField: true,
// })

await addTextSearchFields(Resource.collection.name, ['title', 'description'])

export default 1
