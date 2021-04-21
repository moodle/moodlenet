import { ExecutionParams } from '@graphql-tools/delegate/types'
import { Request } from 'express'
import { GraphQLError } from 'graphql'
import { Flow } from '../../lib/domain/flow'
import { newAnonCtx } from '../executionContext'
import { MoodleNetAuthenticatedExecutionContext } from '../types'
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

export function getExecutionGlobalValues({
  context,
}: ExecutionParams<Record<string, any>, Request>): {
  context: MoodleNetExecutionContext<'anon' | 'session'>
  root: RootValue
  flow: Flow
} {
  const mnHttpSessionCtx: MoodleNetExecutionContext<'anon' | 'session'> = context?.mnHttpSessionCtx ?? newAnonCtx()
  const flow = graphQLRequestFlow()
  return {
    context: { ...mnHttpSessionCtx, flow },
    root: {},
    flow,
  }
}
