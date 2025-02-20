import { int } from '@moodle/lib-types'
import { contributorSpace } from '../moodlenet.model'

export const EMPTY_CONTRIBUTOR_SPACE: moo.model.type.spaceData<contributorSpace> = {
  points: int(0),
}
