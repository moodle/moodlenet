import { map } from '@moodle/lib-types'
import { event_layer, primary_layer, secondary_layer, watcher } from './types'

export type ddd<
  primary extends map<primary_layer> = map<primary_layer>,
  secondary extends map<secondary_layer> = map<secondary_layer>,
  event extends map<event_layer> = map<event_layer>,
> = {
  primary: primary
  secondary: secondary
  event: event
  watch: watcher<primary, secondary>
}
