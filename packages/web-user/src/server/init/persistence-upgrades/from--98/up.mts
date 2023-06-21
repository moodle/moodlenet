import { webSlug } from '@moodlenet/react-app/common'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Profile } from '../../sys-entities.mjs'

const c = await sysEntitiesDB.query({
  query: `FOR p in @@collection RETURN p`,
  bindVars: { '@collection': Profile.collection.name },
})

while (c.hasNext) {
  const { _key, displayName } = await c.next()
  await Profile.collection.update(_key, { webslug: webSlug(displayName) })
}

export default -97
