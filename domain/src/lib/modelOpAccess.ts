import { any_, map } from '@moodle/lib-types'
import { Either, left, right } from 'fp-ts/Either'
import { loggerProvider } from '../types/log'
import { Error4xx, isError4xx } from './access-error'
import { modelHandleProxy } from './modelHandleProxy'

type executeModelOpsDeps = {
  asyncExecStrategy: null | 'defer call later' | 'execute deferred call' | 'immediate'
  models: map
  access: moo.model.access<any_>
  backModelAccessDispatcher: moo.model.dispatcher
  loggerProvider: loggerProvider
}

export async function executeModelOps({ asyncExecStrategy, models, access, backModelAccessDispatcher, loggerProvider }: executeModelOpsDeps) {
  const myLogger = loggerProvider({ for: 'infra', name: 'executeModelOps', access, models: Object.keys(models), asyncExecStrategy })

  const targets = allModelsOpExtracts({ models, access, backModelAccessDispatcher, loggerProvider })
  if (asyncExecStrategy !== 'execute deferred call') {
    await Promise.all(
      targets.or.map(({ fn, modelName }) =>
        fn().catch(err => {
          myLogger.error(`Error in "or" exec model ${modelName}`, err)
          //REVIEW: should we throw an error here?
        }),
      ),
    )
  }
  if (asyncExecStrategy === 'defer call later') {
    return
  }

  const exe = targets.exe[0] ?? {
    fn: async () => new Error4xx('Not Implemented', { message: `No exec implementations of model target: ${access.target}` }),
    modelName: '~',
  }

  if (targets.exe.length > 1) {
    const MULTIPLE_EXEC_MESSAGE = `Multiple implementations of model target: ${access.target}
  all others will be ignored`
    //REVIEW: should we throw an error here?
    myLogger.critical(MULTIPLE_EXEC_MESSAGE)
  }

  const result = await exe.fn().catch<Error4xx>(e => {
    myLogger.error('Model execution error', e)
    return isError4xx(e) ? e : new Error4xx('Internal Server Error', { message: e.message })
  })

  await Promise.all(
    targets.and.map(({ fn, modelName }) =>
      fn(isError4xx(result) ? left(result) : right(result)).catch(andError => {
        myLogger.error(`And error in model ${modelName}`, andError)
        //REVIEW: should we throw an error here?
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
      const { and, exe, or } = modelOpExtract({
        model: { name: modelName, impl },
        access,
        backModelAccessDispatcher,
        loggerProvider,
      })
      and && acc.and.push({ fn: and, modelName })
      exe && acc.exe.push({ fn: exe, modelName })
      or && acc.or.push({ fn: or, modelName })
      return acc
    },
    { and: [], or: [], exe: [] } as {
      exe: { modelName: string; fn: Exclude<modelExtraction['exe'], undefined> }[]
      or: { modelName: string; fn: Exclude<modelExtraction['or'], undefined> }[]
      and: { modelName: string; fn: Exclude<modelExtraction['and'], undefined> }[]
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
  const or = typeModelImpl?.[`| ${access.target.opName}`] as undefined | moo.model.impl.or<any_>
  const and = typeModelImpl?.[`= ${access.target.opName}`] as undefined | moo.model.impl.and<any_>
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
    or: or && (() => or(...exeArgs)),
    and: and && ((outcome: Either<Error4xx, unknown>) => and(outcome, ...exeArgs)),
  }
}
