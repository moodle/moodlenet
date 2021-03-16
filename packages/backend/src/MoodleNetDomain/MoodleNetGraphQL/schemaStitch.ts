import { stitchSchemas } from '@graphql-tools/stitch'
// import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { getServiceSubschemaConfig } from './schemaHelpers'

// const { stitchingDirectivesValidator } = stitchingDirectives() // keep these commented as a reminder casue I'm not sure if useful

export const schema = stitchSchemas({
  // schemaTransforms: [stitchingDirectivesValidator], // keep these commented as a reminder casue I'm not sure if useful
  directiveResolvers: {},
  subschemas: [
    getServiceSubschemaConfig({ srvName: 'UserAuth' }),
    getServiceSubschemaConfig({ srvName: 'ContentGraph' }),
  ],
})
