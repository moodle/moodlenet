import { Executor } from '@graphql-tools/delegate/types'
import { GraphQLError } from 'graphql'
import { IncomingMessage } from 'http'
import { Flow } from '../../lib/domain/flow'
import { Id } from '../services/UserAuth/types'
import { MoodleNetAuthenticatedExecutionContext } from '../types'
import { INVALID_TOKEN } from './JWT'
import { getJwtVerifier } from './MoodleNetGraphQL.env'
import { graphQLRequestFlow } from './schemaHelpers'
import { MoodleNetExecutionContext, RootValue } from './types'

export function throwLoggedUserOnly(_: { context: MoodleNetExecutionContext }): MoodleNetExecutionContext<'session'> {
  if (_.context.type !== 'session') {
    throw new GraphQLError('Logged in users only')
  }
  return _.context
}

export function getSessionContext(
  context: MoodleNetAuthenticatedExecutionContext,
): MoodleNetExecutionContext<'session'> {
  if (context.type === 'session') {
    return context
  }
  return context.as
}

export const SYSTEM_PROFILE_ID = 'Profile/SYSTEM' as Id

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
