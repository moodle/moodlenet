import BoolExpr from 'boolean-expressions'
import { MoodleNetExecutionContext } from '../../executionContext/types'
import { CtxAssertion } from '../../graphql/types.graphql.gen'
import { AssertionOf } from '../../utils/op-chain'
import { _ctx } from '../op-chains'

type CtxAssertionMap = {
  [t in CtxAssertion]: (_: { ctx: MoodleNetExecutionContext }) => boolean
}
export const ctxAssertionMap: CtxAssertionMap = {
  ExecutorIsAdmin: ({ ctx }) => ctx.type === 'session' && ctx.role === 'Admin',
  ExecutorIsAuthenticated: ({ ctx }) => ctx.type === 'session',
  ExecutorIsAnonymous: ({ ctx }) => ctx.type === 'anon',
  ExecutorIsSystem: ({ ctx }) => ctx.type === 'system',
}
export const assertCtx = (ctx: MoodleNetExecutionContext, ctxAssertion: AssertionOf<typeof _ctx>) => {
  if (typeof ctxAssertion === 'boolean') {
    return ctxAssertion
  }
  const boolExpr = new BoolExpr(ctxAssertion())
  const exprVars = boolExpr.getVariableNames()

  const truthyVars = exprVars.filter(exprVar => {
    if (!(exprVar in ctxAssertionMap)) {
      throw new Error(`no ctx assertion impl for: "${exprVar}"`)
    }
    return ctxAssertionMap[exprVar as CtxAssertion]({ ctx })
  })
  // console.log({ ctxAssertion, ctx, exprVars, truthyVars })

  return boolExpr.evaluate(truthyVars) ? true : false
}
