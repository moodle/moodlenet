import { graphql } from 'graphql'
import { MoodleNet } from '../../..'
import { getContentGraphExecutableSchema } from '../schema'

getContentGraphExecutableSchema().then((schema) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.GQL',
    async handler({ req: { ctx, req } }) {
      console.log('WWW')
      console.log({ ctx, req })
      const resp = await graphql(
        schema,
        req.source,
        {},
        ctx,
        req.args
        // req.operationName
      )
      const gqlresp = { data: resp.data, errors: undefined }
      console.log('gqlresp', gqlresp)
      return gqlresp
    },
  })
})
