import { digestActivityEvent } from '../srv/digestActivities.mjs'

let t = null
async function digestLoop() {
  const activity = await getNextActivityFromLastOneDigested()
  const nextAfter = activity ? 0 : 2000
  activity && (await digestActivityEvent(activity))
  t = setTimeout(digestLoop, nextAfter)
}
digestLoop()
t
function getNextActivityFromLastOneDigested() {
  return null
}
