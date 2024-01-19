import { shell } from '../../../shell.mjs'

await shell.initiateCall(async () => {
  await import('./create-virtual-activity-events/user.mjs')
})

export default 4
