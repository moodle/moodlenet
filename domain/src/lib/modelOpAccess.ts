import { any_, map } from '@moodle/lib-types'
import { Either, left, right } from 'fp-ts/Either'
import { loggerProvider } from '../types/log'
import { Error4xx, isError4xx } from './access-error'
import { modelHandleProxy } from './modelHandleProxy'

type executeModelOpsDeps = {
  models: map
  access: moo.model.access<any_>
  backModelAccessDispatcher: moo.model.dispatcher
  loggerProvider: loggerProvider
}

export async function preModelOps({ models, access, backModelAccessDispatcher, loggerProvider }: executeModelOpsDeps) {
  const allOpTargets = allModelsOpExtracts({ models, access, backModelAccessDispatcher, loggerProvider })
  const exeTargets = allOpTargets.exe
  const implementationExists = exeTargets.length > 0
  const step = implementationExists ? 'pre' : ('noImpl' as const)
  const myLogger = loggerProvider({ for: 'infra', name: 'preModelOps', access, models: Object.keys(models), step })
  await Promise.all(
    allOpTargets[step].map(({ fn, modelName }) =>
      fn().catch(err => {
        myLogger.error(`Error in "${step}" exec model ${modelName}`, err)
        //REVIEW: should we throw an error here? if so it would brake the flow...
      }),
    ),
  )
}

export async function executeModel({ models, access, backModelAccessDispatcher, loggerProvider }: executeModelOpsDeps) {
  const myLogger = loggerProvider({ for: 'infra', name: 'executeModel', access, models: Object.keys(models), step: 'exe' })

  const allOpTargets = allModelsOpExtracts({ models, access, backModelAccessDispatcher, loggerProvider })
  const exe = allOpTargets.exe[0] ?? {
    fn: async (): Promise<never> =>
      Promise.reject(new Error4xx('Not Implemented', { message: `No exec implementations of model target: ${access.target.path.join('.')}.${access.target.opName}` })),
    modelName: '~',
  }

  if (allOpTargets.exe.length > 1) {
    const MULTIPLE_EXEC_MESSAGE = `Multiple implementations of model target: ${access.target.path.join('.')}.${access.target.opName} detected,
  will call the first from "${exe.modelName}" model all others will be ignored`
    //REVIEW: should we throw an error here?
    myLogger.critical(MULTIPLE_EXEC_MESSAGE)
  }

  const outcome: Error4xx | unknown = await exe.fn().catch<Error4xx>(e => {
    if (isError4xx(e)) {
      return e
    }
    myLogger.error('Model execution error', e)
    return new Error4xx('Internal Server Error', { message: e.message })
  })

  return isError4xx(outcome) ? left(outcome) : right(outcome)
}

export async function postModelOps({ models, access, outcome, backModelAccessDispatcher, loggerProvider }: executeModelOpsDeps & { outcome: Either<Error4xx, unknown> }) {
  const myLogger = loggerProvider({ for: 'infra', name: 'postModelOps', access, models: Object.keys(models), step: 'post' })

  const allOpTargets = allModelsOpExtracts({ models, access, backModelAccessDispatcher, loggerProvider })

  await Promise.all(
    allOpTargets.post.map(({ fn, modelName }) =>
      fn(outcome).catch(andError => {
        myLogger.error(`And error in model ${modelName}`, andError)
        //REVIEW: should we throw an error here? if so it would brake the flow...
      }),
    ),
  )
}

type allModelsOpExtractsDeps = {
  models: map
  access: moo.model.access<any_>
  backModelAccessDispatcher: moo.model.dispatcher
  loggerProvider: loggerProvider
}

export function allModelsOpExtracts({ models, access, backModelAccessDispatcher, loggerProvider }: allModelsOpExtractsDeps) {
  return Object.entries(models).reduce(
    (acc, [modelName, impl]) => {
      const { post, exe, pre, noImpl } = modelOpExtract({
        model: { name: modelName, impl },
        access,
        backModelAccessDispatcher,
        loggerProvider,
      })
      post && acc.post.push({ fn: post, modelName })
      exe && acc.exe.push({ fn: exe, modelName })
      pre && acc.pre.push({ fn: pre, modelName })
      noImpl && acc.noImpl.push({ fn: noImpl, modelName })
      return acc
    },
    { post: [], pre: [], exe: [], noImpl: [] } as {
      exe: { modelName: string; fn: Exclude<modelExtraction['exe'], undefined> }[]
      pre: { modelName: string; fn: Exclude<modelExtraction['pre'], undefined> }[]
      post: { modelName: string; fn: Exclude<modelExtraction['post'], undefined> }[]
      noImpl: { modelName: string; fn: Exclude<modelExtraction['noImpl'], undefined> }[]
    },
  )
}

type modelOpExtractDeps = {
  model: { impl: any_; name: any_ }
  access: moo.model.access<any_>
  backModelAccessDispatcher: moo.model.dispatcher
  loggerProvider: loggerProvider
}
type modelExtraction = ReturnType<typeof modelOpExtract>
export function modelOpExtract({ model, access, backModelAccessDispatcher, loggerProvider }: modelOpExtractDeps) {
  const handle = modelHandleProxy({
    modelAccessDispatcher: backModelAccessDispatcher,
    origin: {
      from: access.target,
      useCase: access.origin.useCase,
    },
  })
  const typeModelImpl = access.target.path.reduce((_model, prop) => _model?.[prop], model.impl)
  const exe = typeModelImpl?.[`* ${access.target.opName}`] as undefined | moo.model.impl.exe<any_>
  const pre = typeModelImpl?.[`^ ${access.target.opName}`] as undefined | moo.model.impl.pre<any_>
  const post = typeModelImpl?.[`$ ${access.target.opName}`] as undefined | moo.model.impl.post<any_>
  const noImpl = typeModelImpl?.[`! ${access.target.opName}`] as undefined | moo.model.impl.noImpl<any_>
  const log = loggerProvider({ for: 'model', access })
  const now = new Date().toISOString()
  const ctx: moo.model.impl.ctx<any_> = {
    access: { ...access, now },
    log,
    now: new Date().toISOString(),
  }
  const exeArgs: moo.model.impl.exeArgs<any_> = [access.message, handle, ctx]
  return {
    exe: exe && (() => exe(...exeArgs)),
    pre: pre && (() => pre(...exeArgs)),
    noImpl: noImpl && (() => noImpl(...exeArgs)),
    post: post && ((outcome: Either<Error4xx, unknown>) => post(outcome, ...exeArgs)),
  }
}
