import { addTextSearchFields } from '@moodlenet/system-entities/server'
import { Collection, TEXT_SEARCH_INDEX_NAME } from '../../sys-entities.mjs'

await Collection.collection.ensureIndex({
  name: TEXT_SEARCH_INDEX_NAME,
  type: 'inverted',
  fields: ['title', 'description'],
  analyzer: 'text_en',
  searchField: true,
})
await addTextSearchFields(Collection.collection.name, ['title', 'description'])

export default -98
