import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import fk from 'faker'
import { rndImgAssetRef } from '../../../helpers'
import { Fake } from '../types'

export const Profile = (): Fake<GQL.Profile> => {
  return {
    icon: rndImgAssetRef(),
    name: fk.internet.userName(),
    summary: fk.random.words(5),
  }
}
