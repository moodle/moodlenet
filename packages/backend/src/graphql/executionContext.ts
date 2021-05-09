import { ExecutionParams } from '@graphql-tools/utils'
import { Request } from 'express'
import { GraphQLError } from 'graphql'
import { newAnonCtx } from '../adapters/lib/executionContext'
import { MoodleNetExecutionContext, RootValue } from './types'

export function throwLoggedUserOnly(_: { context: MoodleNetExecutionContext }): MoodleNetExecutionContext<'session'> {
  if (_.context.type !== 'session') {
    throw new GraphQLError('Logged in users only')
  }
  return _.context
}

export function getExecutionGlobalValues({
  context,
}: ExecutionParams<Record<string, any>, Request>): {
  context: MoodleNetExecutionContext<'anon' | 'session'>
  root: RootValue
} {
  const mnHttpSessionCtx: MoodleNetExecutionContext<'anon' | 'session'> = context?.mnHttpSessionCtx ?? newAnonCtx()
  return {
    context: { ...mnHttpSessionCtx },
    root: {},
  }
}
