import { addTextSearchFields } from '@moodlenet/system-entities/server'
import { Collection } from '../../sys-entities.mjs'

// export const TEXT_SEARCH_INDEX_NAME = 'text_search'
// await Collection.collection.ensureIndex({
//   name: TEXT_SEARCH_INDEX_NAME,
//   type: 'inverted',
//   fields: ['title', 'description'],
//   analyzer: 'text_en',
//   searchField: true,
// })
await addTextSearchFields(Collection.collection.name, ['title', 'description'])

export default 1
