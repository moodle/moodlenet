import { db, WebUserCollection } from '../../arangodb.mjs'

const curs = await db.query(
  `
  FOR webuser in @@WebUserCollection
  UPDATE webuser WITH { 
    lastVisit: {
      at: @now
    }
  } IN @@WebUserCollection
  RETURN null
`,
  {
    'now': new Date().toISOString(),
    '@WebUserCollection': WebUserCollection.name,
  },
)
await curs.kill()

export default 9
