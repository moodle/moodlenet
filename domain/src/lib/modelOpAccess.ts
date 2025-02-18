import { any_ } from '@moodle/lib-types'
import { Either, left, right } from 'fp-ts/Either'
import { loggerProvider } from '../types/log'
import { Error4xx, isError4xx } from './access-error'
import { modelHandleProxy } from './modelHandleProxy'

type executeModelOpsDeps = {
  execType: 'pre-async' | 'async' | 'sync'
  models: { name: string; impl: any_ }[]
  access: moo.model.access<any_>
  backModelAccessDispatcher: moo.model.dispatcher
  loggerProvider: loggerProvider
}

export async function executeModelOps({
  execType,
  models,
  access,
  backModelAccessDispatcher,
  loggerProvider,
}: executeModelOpsDeps) {
  const log = loggerProvider({ for: 'infra', name: 'executeModelOps', access, models: Object.keys(models), execType })

  const targets = allModelsOpExtracts({ models, access, backModelAccessDispatcher, loggerProvider })

  if (execType !== 'async') {
    await Promise.all(
      targets.or.map(({ fn, modelName }) =>
        fn().catch(andError => {
          log.error(`Or error in model ${modelName}`, andError)
          //REVIEW: should we throw an error here?
        }),
      ),
    )
  }

  if (execType === 'pre-async') {
    return
  }

  const exe = targets.exe[0] ?? {
    fn: async () =>
      new Error4xx('Not Implemented', { message: `No exec implementations of model target: ${access.target}` }),
    modelName: '~',
  }

  if (targets.exe.length > 1) {
    const MULTIPLE_EXEC_MESSAGE = `Multiple implementations of model target: ${access.target}
  all others will be ignored`
    //REVIEW: should we throw an error here?
    log.critical(MULTIPLE_EXEC_MESSAGE)
  }

  const result = await exe.fn().catch<Error4xx>(e => {
    log.error('Model execution error', e)
    return isError4xx(e) ? e : new Error4xx('Internal Server Error', { message: e.message })
  })

  await Promise.all(
    targets.and.map(({ fn, modelName }) =>
      fn(isError4xx(result) ? left(result) : right(result)).catch(andError => {
        log.error(`And error in model ${modelName}`, andError)
        //REVIEW: should we throw an error here?
      }),
    ),
  )
}

type allModelsOpExtractsDeps = {
  models: { name: string; impl: any_ }[]
  access: moo.model.access<any_>
  backModelAccessDispatcher: moo.model.dispatcher
  loggerProvider: loggerProvider
}

export function allModelsOpExtracts({ models, access, backModelAccessDispatcher, loggerProvider }: allModelsOpExtractsDeps) {
  return models.reduce(
    (acc, model) => {
      const { and, exe, or } = modelOpExtract({ model, access, backModelAccessDispatcher, loggerProvider })
      and && acc.and.push({ fn: and, modelName: model.name })
      exe && acc.exe.push({ fn: exe, modelName: model.name })
      or && acc.or.push({ fn: or, modelName: model.name })
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
  const ctx: moo.model.impl.ctx<any_> = { access, log, handle, now: new Date().toISOString() }
  return {
    exe: exe && (() => exe(ctx)),
    or: or && (() => or(ctx)),
    and: and && ((outcome: Either<Error4xx, unknown>) => and(outcome, ctx)),
  }
}
