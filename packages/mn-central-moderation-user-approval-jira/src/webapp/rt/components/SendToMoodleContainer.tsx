import { SendToMoodle } from '../../ui/components/SendToMoodle.js'
import { useSendToMoodle } from './sendToMoodleHook.mjs'

export function SendToMoodleContainer() {
  const props = useSendToMoodle()
  return <SendToMoodle {...props} />
}
