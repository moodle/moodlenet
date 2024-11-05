import { Profile } from '../../sys-entities.mjs'

await Profile.collection.ensureIndex({
  type: 'persistent',
  name: 'deleted',
  fields: ['deleted'],
})

export default 10
