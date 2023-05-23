import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Profile } from '../../sys-entities.mjs'

await sysEntitiesDB.query({
  query: `
FOR p in @@collection
UPDATE p WITH {kudos:0} IN @@collection 
RETURN null
`,
  bindVars: { '@collection': Profile.collection.name },
})
export default -98
