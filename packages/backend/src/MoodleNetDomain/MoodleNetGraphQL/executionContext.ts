import { Executor } from '@graphql-tools/delegate/types'
import { GraphQLError } from 'graphql'
import { IncomingMessage } from 'http'
import { Flow } from '../../lib/domain/flow'
import { INVALID_TOKEN } from './JWT'
import { getJwtVerifier } from './MoodleNetGraphQL.env'
import { graphQLRequestFlow } from './schemaHelpers'
import { MoodleNetExecutionContext, RootValue } from './types'

export function throwLoggedUserOnly(_: { context: MoodleNetExecutionContext }): MoodleNetExecutionContext<'session'> {
  const { context } = _
  if (context.type !== 'session') {
    throw new GraphQLError('Logged in users only')
  }
  return context
}

export function getExecutionGlobalValues(
  ...args: Parameters<Executor>
): {
  context: MoodleNetExecutionContext<'anon' | 'session'>
  root: RootValue
  flow: Flow
} {
  const verifyJwt = getJwtVerifier()
  const { context } = args[0]
  const jwtHeader = (context as IncomingMessage)?.headers?.bearer
  const jwtToken = jwtHeader && (typeof jwtHeader === 'string' ? jwtHeader : jwtHeader[0])
  const tokenVerification = verifyJwt(jwtToken)
  const flow = graphQLRequestFlow()

  return {
    context: tokenVerification === INVALID_TOKEN || !tokenVerification ? { type: 'anon', flow } : tokenVerification,
    root: {},
    flow,
  }
}
