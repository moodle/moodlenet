import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import { License } from '../../sys-entities.mjs'

await shell.initiateCall(async () => {
  await setPkgCurrentUser()
  await License.collection.update(
    { _key: 'cc-by-nd' },
    {
      description: 'Attribution + NoDerivatives',
    },
  )
})

export default 5
