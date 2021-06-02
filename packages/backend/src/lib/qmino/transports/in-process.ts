import * as QM from '../types'

const attemptLocalResolve = <Action extends QM.AnyQMAction>(
  actionExtract: QM.ActionExtract<Action>,
): null | (() => Promise<QM.QMActionResponse<Action>>) => {
  const { deployment, action /* , args, port */ } = actionExtract
  if (!deployment) {
    return null
  }
  const { adapter } = deployment

  return () => action(adapter)
}

const queryResolver: QM.ActionResolver = actionExtract => {
  const maybeLocalExecutor = attemptLocalResolve(actionExtract)
  if (!maybeLocalExecutor) {
    throw new Error(`port not open locally`)
  }
  return maybeLocalExecutor
}

export const InProcessActionResolverDelegates: { [t in QM.QMPortType]: QM.ActionResolver } = {
  query: queryResolver,
  command: actionExtract => {
    console.warn(`InProcess Transport : \`command\` not implemented properly, will use \`query\``)
    return queryResolver(actionExtract)
  },
  event: (() => {
    throw new Error('event unimplemented')
  }) as any,
}
