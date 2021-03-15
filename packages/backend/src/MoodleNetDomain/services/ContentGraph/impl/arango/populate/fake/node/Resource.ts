import fk from 'faker'
import * as GQL from '../../../../../ContentGraph.graphql.gen'
import { rndImg } from '../helpers'
import { Fake } from '../types'

export const Resource = (): Fake<GQL.Resource> => {
  return {
    name: fk.random.words(4),
    icon: rndImg(200, 200),
    summary: fk.random.words(5),
  }
}
