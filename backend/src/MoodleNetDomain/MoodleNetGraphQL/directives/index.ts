import * as GQL from '../global.graphql.gen'
import { access } from './access'

const directiveResolvers: GQL.DirectiveResolvers = {
  access,
}

export default directiveResolvers as any //TODO: try remove this any
