import fk from 'faker'
import * as GQL from '../../../../../ContentGraph.graphql.gen'
import { rndImgAssetRef } from '../helpers'
import { Fake } from '../types'

export const Collection = (): Fake<GQL.Collection> => {
  return {
    name: fk.random.words(3),
    icon: rndImgAssetRef(200, 200),
    summary: fk.random.words(5),
  }
}
