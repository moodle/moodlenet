import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import fk from 'faker'
import { rndThumbAssetRef } from '../../../helpers'
import { Fake } from '../types'

export const Profile = (): Fake<GQL.Profile> => {
  return {
    icon: rndThumbAssetRef(),
    name: fk.internet.userName(),
    summary: fk.random.words(5),
  }
}
