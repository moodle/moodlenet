import { db, WebUserCollection } from '../../arangodb.mjs'

const curs = await db.query(
  `
  FOR webuser in @@WebUserCollection

  LET now = DATE_NOW() 
  LET rnd_h = ROUND(RAND() * 24 * 15)

  LET date_sub = DATE_SUBTRACT(now, rnd_h, 'h')
  LET date_round = DATE_ROUND(date_sub, 1, 'h')          
  LET date_iso = DATE_ISO8601(date_round)

  UPDATE webuser WITH { 
    lastVisit: {
      at: date_iso
    }
  } IN @@WebUserCollection
  RETURN null
`,
  {
    '@WebUserCollection': WebUserCollection.name,
  },
)
await curs.kill()

export default 9
