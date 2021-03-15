import fk from 'faker'
import * as GQL from '../../../../../ContentGraph.graphql.gen'
import { rndImg } from '../helpers'
import { Fake } from '../types'

export const Collection = (): Fake<GQL.Collection> => {
  return {
    name: fk.random.words(3),
    icon: rndImg(200, 200),
    summary: fk.random.words(5),
  }
}
