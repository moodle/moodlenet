import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import fk from 'faker'
import { rndThumbAssetRef } from '../../../helpers'
import { Fake } from '../types'

export const Resource = (): Fake<GQL.Resource> => {
  return {
    name: fk.random.words(4),
    icon: rndThumbAssetRef(),
    summary: fk.random.words(5),
    asset: rndThumbAssetRef(),
  }
}
