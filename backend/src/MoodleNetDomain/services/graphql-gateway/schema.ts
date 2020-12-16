import { makeExecutableSchema } from 'apollo-server-express'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Context } from '../../GQL'
import { accountingResolvers } from '../accounting/graphql/resolvers'
import { mergeResolvers } from '@graphql-tools/merge'

export const typeDefs = readFileSync(
  resolve(__dirname, '../../../../main.schema.gen.graphql'),
  'utf-8'
)

export const schema = makeExecutableSchema<Context>({
  typeDefs: [typeDefs],
  resolvers: mergeResolvers([accountingResolvers as any]),
})
