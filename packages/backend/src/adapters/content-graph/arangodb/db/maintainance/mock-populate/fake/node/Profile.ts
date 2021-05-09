import fk from 'faker'
import * as GQL from '../../../../../ContentGraph.graphql.gen'
import { rndImgAssetRef } from '../helpers'
import { Fake } from '../types'

export const Profile = (): Fake<GQL.Profile> => {
  return {
    icon: rndImgAssetRef(200, 200),
    name: fk.internet.userName(),
    summary: fk.random.words(5),
  }
}
