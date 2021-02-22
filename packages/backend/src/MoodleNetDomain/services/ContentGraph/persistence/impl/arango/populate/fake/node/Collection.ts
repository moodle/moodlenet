import fk from 'faker'
import * as GQL from '../../../../../../ContentGraph.graphql.gen'
import { Fake } from '../types'

export const Collection = (): Fake<GQL.Collection> => {
  return {
    name: fk.random.words(3),
    icon: fk.image.imageUrl(200, 200),
    summary: fk.lorem.paragraphs(2),
  }
}
