import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Profile } from '@moodlenet/web-user/server'
import {
  deletedUserActions,
  enoughPublishableActions,
  firstContributionActions,
  lastContributionActions,
  secondLastContributionActions,
  userApprovedActions,
  welcomeActions,
} from '../../../actions.mjs'
import { getContributionStatus } from '../../../exports.mjs'
import { shell } from '../../../shell.mjs'
import { fetchContributionStatus, getUserDetails, initiateAsMe } from '../../../srv.mjs'

const BATCH_SIZE = 1
const curs = await sysEntitiesDB.query<{
  profileKey: string
}>(
  `
FOR profile IN @@ProfileCollection
FILTER !profile.deleted


RETURN { profileKey: profile._key}
`,
  {
    '@ProfileCollection': Profile.collection.name,
  },
  { ttl: 60 * 10, batchSize: BATCH_SIZE, fullCount: true, count: true },
)

shell.log('info', `first setup todo: ${curs.count}`)
let done = 0
while (curs.batches.hasNext) {
  const batch = (await curs.batches.next()) ?? []
  await Promise.all(
    batch.map(({ profileKey }) =>
      initiateAsMe(async () => {
        const userDetails = await getUserDetails({ profileKey })
        if (!userDetails || userDetails.deleted) {
          await deletedUserActions({ profileKey })
          return
        }
        if (userDetails.publisher) {
          await userApprovedActions({ profileKey })
          return
        }
        const resourceAmounts = await fetchContributionStatus({ profileKey })

        const contributionStatus = getContributionStatus({ resourceAmounts })
        if (contributionStatus.currentCreatedResourceAmount === 0) {
          await welcomeActions({ userDetails, profileKey })
          return
        }

        const { status, currentCreatedResourceAmount, yetToCreate } = contributionStatus
        switch (status) {
          case 'none':
            await welcomeActions({ userDetails, profileKey })
            break
          case 'first contribution': {
            await firstContributionActions({ profileKey, userDetails, yetToCreate })
            break
          }
          case 'last contribution': {
            await lastContributionActions({
              profileKey,
              userDetails,
              currentCreatedResourceAmount,
            })
            break
          }
          case 'second last contribution': {
            await secondLastContributionActions({
              profileKey,
              userDetails,
              currentCreatedResourceAmount,
            })
            break
          }
          case 'enough publishable': {
            await enoughPublishableActions({ profileKey })
            await userApprovedActions({ profileKey })
            break
          }
        }
      }),
    ),
  )
  done += batch.length
  !(done % 500) && shell.log('info', `first setup done: ${done}`)
}
shell.log('info', `first setup done: ${done}`)

export default 1
