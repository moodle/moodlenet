import { Executor } from '@graphql-tools/delegate/types'
import { ExecutionResult, graphql /* , GraphQLError */, GraphQLSchema, print } from 'graphql'
import { call } from './amqp/call'
import { Flow } from './flow'
import { CallConfig, Wrk, WrkConfig, WrkLeaves } from './wrk'

export const getGQLApiCallerExecutor = <D, C, R>({
  domainName,
  getExecutionGlobalValues,
  path,
  p_opts,
}: {
  domainName?: string
  getExecutionGlobalValues(..._: Parameters<Executor>): { context: C; root: R; flow: Flow }
  path: WrkLeaves<D>
  p_opts?: Partial<CallConfig>
}): Executor => async _ => {
  // console.log(`getGQLApiCallerExecutor`, { domainName, getExecutionGlobalValues, path, p_opts })
  const { context, root, flow } = getExecutionGlobalValues(_)
  const { document, variables /*,context, extensions, info */ } = _
  const query = print(document)

  // console.log(`getGQLApiCallerExecutor`, { path, query })
  const res = await (call<D>(domainName)(path, flow, p_opts) as any)({
    context,
    root,
    query,
    variables,
  })

  return res
}

export function getGQLWrkService<C, R>({
  schema,
  cfg,
}: {
  schema: GraphQLSchema | Promise<GraphQLSchema>
  cfg?: WrkConfig
}): GraphQLDomainWrk<C, R> {
  return {
    kind: 'wrk',
    cfg,
    init: () => {
      // console.log(`getGQLWrkService#init`)
      return [
        async (req: any) => {
          // console.log(`getGQLWrkService#req`, req)
          const { query, root, context, variables } = req
          const resp = await graphql(await schema, query, root, context, variables)
          return {
            data: resp.data,
            errors: resp.errors,
            extensions: resp.extensions,
          }
        },
      ]
    },
  }
}

type GraphQLDomainApiReq<Context, RootValue> = {
  context: Context
  root: RootValue
  query: string
  variables: Record<string, any> | undefined
}

type GraphQLDomainApiResp = {
  [K in keyof Required<ExecutionResult>]: ExecutionResult[K]
}

type GQLWorker<Context, RootValue> = (_: GraphQLDomainApiReq<Context, RootValue>) => Promise<GraphQLDomainApiResp>
export type GraphQLDomainWrk<Context, RootValue> = Wrk<GQLWorker<Context, RootValue>>
