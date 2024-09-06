import { patchEntity, setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import { License } from '../../sys-entities.mjs'

const restrictivenessMap = [
  ['cc-0', 0.01],
  ['cc-by', 0.1],
  ['other-open', 0.15],
  ['cc-by-sa', 0.2],
  ['cc-by-nc', 0.3],
  ['cc-by-nc-sa', 0.4],
  ['cc-by-nd', 0.5],
  ['cc-by-nc-nd', 0.6],
  ['restricted-copyright', 0.9],
] as const

await shell.initiateCall(async () => {
  await setPkgCurrentUser()

  return Promise.all(
    restrictivenessMap.map(([key, restrictiveness]) => {
      shell.call(patchEntity)(License.entityClass, key, {
        restrictiveness,
      })
    }),
  )
})

export default 3
