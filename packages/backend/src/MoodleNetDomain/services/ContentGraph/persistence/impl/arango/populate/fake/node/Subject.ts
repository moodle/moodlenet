import fk from 'faker'
import * as GQL from '../../../../../../ContentGraph.graphql.gen'
import { Fake } from '../types'

export const Subject = (): Fake<GQL.Subject> => {
  return {
    name: fk.random.words(1),
    icon: fk.image.imageUrl(200, 200),
    summary: fk.random.words(5),
  }
}
