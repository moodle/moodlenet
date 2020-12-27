import { ExecutionResult, GraphQLError } from 'graphql'
import { GraphQLResolveInfo } from 'graphql/type/definition'
import { Api } from '../lib/domain/api/types'
import { MoodleNetExecutionContext } from './MoodleNetDomain'

export type GraphQLDomainApiReq<Args> = {
  ctx: MoodleNetExecutionContext
  req: {
    operationName: string
    source: string
    args: Args
  }
}
// export type GraphQLDomainApiResp<Resp> = ExecutionResult<Resp>
export type GraphQLDomainApiResp<Resp> = {
  errors: GraphQLError[] | undefined
  data: Resp | null | undefined
}

export type GraphQLDomainApi<Args, Resp> = Api<
  GraphQLDomainApiReq<Args>,
  GraphQLDomainApiResp<Resp>
>
export type GraphQLDomainMutations<Resolvers> = {
  [Name in keyof Resolvers]: GQLResolversApis<Resolvers[Name]>
}

export type GraphQLDomainQueries<Resolvers> = {
  [Name in keyof Resolvers]: GQLResolversApis<Resolvers[Name]>
}

type GQLResolversApis<Resolver> = Resolver extends (
  p: any, //infer Parent,
  a: infer Args,
  c: any, //infer Ctx,
  info: GraphQLResolveInfo
) => infer Resp
  ? GraphQLDomainApi<Args, Resp>
  : never
