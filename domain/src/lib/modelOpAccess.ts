import { any_, map } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { loggerProvider } from '../types/log'
import { Error4xx, isError4xx } from './access-error'
import { modelHandleProxy } from './modelHandleProxy'

type executeModelOpsDeps = {
  models: map
  envelope: moo.def.model.envelope<any_>
  modelEnvelopeDispatcher: moo.def.model.dispatcher<any_>
  loggerProvider: loggerProvider
}

export async function preModelOps({ models, envelope, modelEnvelopeDispatcher, loggerProvider }: executeModelOpsDeps) {
  const allOpTargets = allModelsOpExtracts({ models, envelope, modelEnvelopeDispatcher, loggerProvider })
  const exeTargets = allOpTargets.exe
  const implementationExists = exeTargets.length > 0
  const layer: keyof moo.def.model.impl.opHandlers = implementationExists ? 'pre' : 'notImpl'
  const myLogger = loggerProvider({ for: 'model', layer, name: 'modelOpAccess:preModelOps', envelope })
  await Promise.all(
    allOpTargets[layer].map(({ fn, workerName: modelName }) =>
      fn().catch(err => {
        myLogger.error(`Error in "${layer}" exec model ${modelName}`, err)
        //REVIEW: should we throw an error here? if so it would brake the flow...
      }),
    ),
  )
}

export async function executeModel({ models, envelope, modelEnvelopeDispatcher, loggerProvider }: executeModelOpsDeps) {
  const myLogger = loggerProvider({ for: 'model', layer: 'exe', name: 'modelOpAccess:executeModel', envelope })
  const allOpTargets = allModelsOpExtracts({ models, envelope, modelEnvelopeDispatcher, loggerProvider })
  const exe = allOpTargets.exe[0] ?? {
    fn: async (): Promise<Either<Error4xx, never>> => {
      const notImplErr = new Error4xx('Not Implemented', { message: `No exec implementations of model target: ${envelope.path.join('.')}` })
      myLogger.warn(notImplErr)
      // return left(notImplErr)
      return Promise.reject(notImplErr)
    },
    workerName: '~',
  }

  if (allOpTargets.exe.length > 1) {
    const MULTIPLE_EXEC_MESSAGE = `Multiple implementations of model target: ${envelope.path.join('.')} detected,
  will call the first from "${exe.workerName}" model all others will be ignored`
    //REVIEW: should we throw an error here?
    myLogger.critical(MULTIPLE_EXEC_MESSAGE)
  }

  const outcome: Error4xx | unknown = await exe.fn().catch<Error4xx>(e => {
    if (isError4xx(e)) {
      return e
    }
    myLogger.error('Model execution error', e, e.stack)
    return new Error4xx('Internal Server Error', { message: e.message })
  })

  return outcome
}

export async function postModelOps({ models, envelope, outcome, modelEnvelopeDispatcher, loggerProvider }: executeModelOpsDeps & { outcome: Either<Error4xx, unknown> }) {
  const myLogger = loggerProvider({ for: 'model', layer: 'post', name: 'modelOpAccess:postModelOps', envelope })

  const allOpTargets = allModelsOpExtracts({ models, envelope, modelEnvelopeDispatcher, loggerProvider })

  await Promise.all(
    allOpTargets.post.map(({ fn, workerName: modelName }) =>
      fn(outcome).catch(andError => {
        myLogger.error(`And error in model ${modelName}`, andError)
        //REVIEW: should we throw an error here? if so it would brake the flow...
      }),
    ),
  )
}

type allModelsOpExtractsDeps = {
  models: map
  envelope: moo.def.model.envelope<any_>
  modelEnvelopeDispatcher: moo.def.model.dispatcher<any_>
  loggerProvider: loggerProvider
}

export function allModelsOpExtracts({ models, envelope, modelEnvelopeDispatcher, loggerProvider }: allModelsOpExtractsDeps) {
  return Object.entries(models).reduce(
    (acc, [workerName, impl]) => {
      const { post, exe, pre, notImpl } = workerOpExtract({
        worker: { name: workerName, impl },
        envelope,
        modelEnvelopeDispatcher,
        loggerProvider,
      })
      post && acc.post.push({ fn: post, workerName })
      exe && acc.exe.push({ fn: exe, workerName })
      pre && acc.pre.push({ fn: pre, workerName })
      notImpl && acc.notImpl.push({ fn: notImpl, workerName })
      return acc
    },
    { post: [], pre: [], exe: [], notImpl: [] } as {
      exe: { workerName: string; fn: Exclude<workerOpExtraction['exe'], undefined> }[]
      pre: { workerName: string; fn: Exclude<workerOpExtraction['pre'], undefined> }[]
      post: { workerName: string; fn: Exclude<workerOpExtraction['post'], undefined> }[]
      notImpl: { workerName: string; fn: Exclude<workerOpExtraction['notImpl'], undefined> }[]
    },
  )
}

type modelOpExtractDeps = {
  worker: { impl: any_; name: any_ }
  envelope: moo.def.model.envelope<any_>
  modelEnvelopeDispatcher: moo.def.model.dispatcher<any_>
  loggerProvider: loggerProvider
}
type workerOpExtraction = ReturnType<typeof workerOpExtract>
export function workerOpExtract({ worker, envelope, modelEnvelopeDispatcher, loggerProvider }: modelOpExtractDeps) {
  const model = modelHandleProxy({
    modelDispatcher: modelEnvelopeDispatcher,
    origin: {
      model: {
        id: envelope.id,
        target: {
          opType: envelope.opType,
          path: envelope.path,
        },
      },
      request: envelope.origin.request,
    },
  })

  const opHandlers: undefined | moo.def.model.impl.opHandlers = envelope.path.reduce((_model, prop) => ('function' === typeof _model ? _model(prop) : _model?.[prop]), worker.impl)

  const exe = opHandlers?.exe
  const pre = opHandlers?.pre
  const post = opHandlers?.post
  const notImpl = opHandlers?.notImpl
  return {
    exe: exe && (() => exe(ctx('exe'))(envelope.message)),
    pre: pre && (() => pre(ctx('pre'))(envelope.message)),
    notImpl: notImpl && (() => notImpl(ctx('notImpl'))(envelope.message)),
    post: post && ((outcome: Either<Error4xx, unknown>) => post(ctx('post'))(outcome, envelope.message)),
  }
  function ctx(layer: keyof moo.def.model.impl.opHandlers) {
    const log = loggerProvider({ for: 'model', envelope, layer, name: worker.name })
    const now = new Date().toISOString()
    const ctx: moo.def.model.impl.ctx<any_> = { model, envelope: { ...envelope, now }, log, now: new Date().toISOString() }
    return ctx
  }
}
