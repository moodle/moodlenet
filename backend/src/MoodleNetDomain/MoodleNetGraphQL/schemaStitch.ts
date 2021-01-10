import { stitchSchemas } from '@graphql-tools/stitch'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { getServiceSubschemaConfig } from './helpers'

const {
  stitchingDirectivesValidator,
  allStitchingDirectivesTypeDefs,
} = stitchingDirectives()

export const schema = stitchSchemas({
  schemaTransforms: [stitchingDirectivesValidator],
  typeDefs: allStitchingDirectivesTypeDefs,
  subschemas: [
    getServiceSubschemaConfig({ srvName: 'UserAccount' }),
    getServiceSubschemaConfig({ srvName: 'ContentGraph' }),
  ],
})
