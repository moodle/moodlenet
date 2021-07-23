import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import fk from 'faker'
import { rndThumbAssetRef } from '../../../helpers'
import { Fake } from '../types'

export const Collection = (): Fake<GQL.Collection> => {
  return {
    name: fk.random.words(3),
    icon: rndThumbAssetRef(),
    summary: fk.random.words(5),
  }
}
