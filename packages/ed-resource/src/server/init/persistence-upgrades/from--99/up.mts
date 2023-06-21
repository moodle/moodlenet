import { Resource, TEXT_SEARCH_INDEX_NAME } from '../../sys-entities.mjs'

await Resource.collection.ensureIndex({
  name: TEXT_SEARCH_INDEX_NAME,
  type: 'inverted',
  fields: ['title', 'description'],
  analyzer: 'text_en',
  searchField: true,
})

export default -98
