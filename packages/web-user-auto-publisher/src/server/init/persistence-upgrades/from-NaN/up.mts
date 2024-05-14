import { Resource } from '@moodlenet/ed-resource/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { env } from '../../../env.mjs'
import { webUserCreatedResource } from '../../../exports.mjs'
import { shell } from '../../../shell.mjs'

const curs = await sysEntitiesDB.query<{
  profileKey: string
  // unpublishedResourceAmount: number
  // send: 'first' | 'last' | 'publisher
}>(
  `
FOR r IN @@ResourceCollection
FILTER !r.published

LET creatorProfile = DOCUMENT(r._meta.creatorEntityId)

FILTER creatorProfile && !creatorProfile.publisher

COLLECT profileKey = creatorProfile._key WITH COUNT INTO unpublishedResourceAmount

LET send = unpublishedResourceAmount == 1                             ? 'first' 
        :  unpublishedResourceAmount == (@amountForAutoApproval - 1)  ? 'last'
        :  unpublishedResourceAmount >= @amountForAutoApproval        ? 'publisher'
        : null

FILTER send

RETURN { profileKey } //, unpublishedResourceAmount, send}
`,
  {
    '@ResourceCollection': Resource.collection.name,
    'amountForAutoApproval': env.amountForAutoApproval,
  },
  { ttl: 60 * 10, batchSize: 50, fullCount: true, count: true },
)
shell.log('info', `first setup todo: ${curs.count}`)
let done = 0
while (curs.batches.hasNext) {
  const batch = (await curs.batches.next()) ?? []
  await Promise.all(batch.map(({ profileKey }) => webUserCreatedResource({ profileKey })))
  done += batch.length
  !(done % 500) && shell.log('info', `first setup done: ${done}`)
}
shell.log('info', `first setup done: ${done}`)

export default 1
