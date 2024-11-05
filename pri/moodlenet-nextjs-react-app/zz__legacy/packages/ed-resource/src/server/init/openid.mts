import { registerScopes } from '@moodlenet/core'
import { shell } from '../shell.mjs'

await shell.call(registerScopes)({
  'write.own': { description: 'create and update owned resources' },
})
