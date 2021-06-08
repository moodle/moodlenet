import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import fk from 'faker'
import { rndImgAssetRef } from '../../../helpers'
import { Fake } from '../types'

export const Collection = (): Fake<GQL.Collection> => {
  return {
    name: fk.random.words(3),
    icon: rndImgAssetRef(),
    summary: fk.random.words(5),
  }
}
