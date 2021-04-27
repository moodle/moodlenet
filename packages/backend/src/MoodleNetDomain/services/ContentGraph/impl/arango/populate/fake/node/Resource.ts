import fk from 'faker'
import * as GQL from '../../../../../ContentGraph.graphql.gen'
import { rndImgAssetRef } from '../helpers'
import { Fake } from '../types'

export const Resource = (): Fake<GQL.Resource> => {
  return {
    name: fk.random.words(4),
    icon: rndImgAssetRef(200, 200),
    summary: fk.random.words(5),
  }
}
