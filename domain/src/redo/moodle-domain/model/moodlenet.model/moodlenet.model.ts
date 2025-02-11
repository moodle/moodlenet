/* eslint-disable @typescript-eslint/no-namespace */
import { map } from '@moodle/lib-types'
declare global {
  namespace moo {
    interface Models {
      moodlenet: moodlenet
    }
  }
}

export type moodlenet = moo.model<map>
