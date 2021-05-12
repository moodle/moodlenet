import { ctxAssertionMap } from '@moodlenet/common/lib/assertions/static/assertCtx'
import {
  Assertion,
  AssertionExpr,
  ConnAssertion,
  CtxAssertion,
  NodeAssertion,
} from '@moodlenet/common/lib/content-graph'
import { MoodleNetExecutionContext } from '@moodlenet/common/lib/executionContext/types'
import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { AssertionOf } from '@moodlenet/common/src/utils/op-chain'
import BoolExpr from 'boolean-expressions'
import { connAssertionMap } from './edge'
import { nodeAssertionMap } from './node'

export type AssertionArg = {
  ctx: MoodleNetExecutionContext
  edgeType: EdgeType | null
  thisNodeVar: string | null
  edgeVar: string | null
}

export const toAqlAssertionExprMapAndAqlString = ({
  ctx,
  edgeType,
  expr,
  edgeVar,
  thisNodeVar,
}: {
  expr: AssertionOf<any> | boolean
  thisNodeVar: string | null
  edgeVar: string | null
  edgeType: EdgeType | null
  ctx: MoodleNetExecutionContext
}) => {
  // if(typeof expr === 'boolean'){
  //   return {

  //   }
  // }
  const assertionMapResult = toAqlAssertionExprMap({
    ctx,
    edgeType,
    expr: typeof expr === 'boolean' ? expr : expr(),
    edgeVar,
    thisNodeVar,
  })
  if (typeof assertionMapResult === 'string') {
    return {
      aqlExprMapString: `${assertionMapResult}`,
      aqlExprMap: {},
      exprVarNames: [],
      exprString: `${assertionMapResult}`,
      aqlFilter: `${assertionMapResult}`,
    }
  }
  const { aqlExprMap, exprVarNames, exprString } = assertionMapResult
  const _aqlExprMapString = Object.entries(aqlExprMap)
    .map(([exprName, aqlExpr]) => `${exprName}: ${aqlExpr}`)
    .join(',\n')
  const aqlExprMapString = `{ ${_aqlExprMapString} }`

  // console.log({ assertionMapResult })
  const aqlFilter = exprVarNames.reduce(
    (reducedExprString, varName) => reducedExprString.replace(new RegExp(varName, 'g'), aqlExprMap[varName] || ''),
    exprString,
  )

  return {
    aqlExprMapString,
    aqlExprMap,
    exprVarNames,
    exprString,
    aqlFilter,
  }
}

export const toAqlAssertionExprMap = ({
  ctx,
  edgeType,
  expr,
  edgeVar,
  thisNodeVar,
}: {
  expr: AssertionExpr
  thisNodeVar: string | null
  edgeVar: string | null
  edgeType: EdgeType | null
  ctx: MoodleNetExecutionContext
}) => {
  if (typeof expr === 'boolean') {
    return `( /* ${thisNodeVar || ''} ${edgeVar || ''} ${edgeType || ''} */ ${expr}  )`
  }
  const boolExpr = new BoolExpr(expr)
  const exprVarNames = boolExpr.getVariableNames() as Assertion[]
  const aqlExprMap = exprVarNames.reduce((expressionsMap, exprVarName) => {
    const assertionFn =
      exprVarName in nodeAssertionMap
        ? nodeAssertionMap[exprVarName as NodeAssertion]
        : exprVarName in connAssertionMap
        ? connAssertionMap[exprVarName as ConnAssertion]
        : exprVarName in ctxAssertionMap
        ? ctxAssertionMap[exprVarName as CtxAssertion]
        : null
    if (!assertionFn) {
      throw new Error(`No assertion implementation for expression name: "${exprVarName}"`)
    }
    const assertion = assertionFn({ ctx, edgeType, thisNodeVar, edgeVar })
    const comment = `/* ${thisNodeVar || ''} ${exprVarName} :*/`
    return {
      ...expressionsMap,
      [exprVarName]: `( ${comment} ${assertion} )`,
    }
  }, {} as { [assertion in Assertion]?: string })

  return {
    aqlExprMap,
    exprVarNames,
    exprString: expr,
  }
}
