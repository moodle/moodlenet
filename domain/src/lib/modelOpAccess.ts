import { any_, map } from '@moodle/lib-types'
import { Either, left, right } from 'fp-ts/Either'
import { loggerProvider } from '../types/log'
import { Error4xx, isError4xx } from './access-error'
import { modelHandleProxy } from './modelHandleProxy'

type executeModelOpsDeps = {
  models: map
  envelope: moo.model.envelope<any_>
  backModelEnvelopeDispatcher: moo.model.dispatcher<any_>
  loggerProvider: loggerProvider
}

export async function preModelOps({ models, envelope, backModelEnvelopeDispatcher, loggerProvider }: executeModelOpsDeps) {
  const allOpTargets = allModelsOpExtracts({ models, envelope, backModelEnvelopeDispatcher, loggerProvider })
  const exeTargets = allOpTargets.exe
  const implementationExists = exeTargets.length > 0
  const step = implementationExists ? 'pre' : ('notImpl' as const)
  const myLogger = loggerProvider({ for: 'model', more: { name: `${step}:op` /*  models: Object.keys(models) */ }, envelope: envelope })
  await Promise.all(
    allOpTargets[step].map(({ fn, modelName }) =>
      fn().catch(err => {
        myLogger.error(`Error in "${step}" exec model ${modelName}`, err)
        //REVIEW: should we throw an error here? if so it would brake the flow...
      }),
    ),
  )
}

export async function executeModel({ models, envelope, backModelEnvelopeDispatcher, loggerProvider }: executeModelOpsDeps) {
  const myLogger = loggerProvider({ for: 'model', more: { name: `exec:op` /*  models: Object.keys(models) */ }, envelope: envelope })
  const allOpTargets = allModelsOpExtracts({ models, envelope, backModelEnvelopeDispatcher, loggerProvider })
  const exe = allOpTargets.exe[0] ?? {
    fn: async (): Promise<never> => {
      const notImplErr = new Error4xx('Not Implemented', { message: `No exec implementations of model target: ${envelope.target.path.join('.')}.${envelope.target.opName}` })
      myLogger.warn(notImplErr)
      return Promise.reject(notImplErr)
    },
    modelName: '~',
  }

  if (allOpTargets.exe.length > 1) {
    const MULTIPLE_EXEC_MESSAGE = `Multiple implementations of model target: ${envelope.target.path.join('.')}.${envelope.target.opName} detected,
  will call the first from "${exe.modelName}" model all others will be ignored`
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

  return isError4xx(outcome) ? left(outcome) : right(outcome)
}

export async function postModelOps({ models, envelope, outcome, backModelEnvelopeDispatcher, loggerProvider }: executeModelOpsDeps & { outcome: Either<Error4xx, unknown> }) {
  const myLogger = loggerProvider({ for: 'model', more: { name: `post:op` /*  models: Object.keys(models) */ }, envelope: envelope })

  const allOpTargets = allModelsOpExtracts({ models, envelope, backModelEnvelopeDispatcher, loggerProvider })

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
  envelope: moo.model.envelope<any_>
  backModelEnvelopeDispatcher: moo.model.dispatcher<any_>
  loggerProvider: loggerProvider
}

export function allModelsOpExtracts({ models, envelope: envelope, backModelEnvelopeDispatcher, loggerProvider }: allModelsOpExtractsDeps) {
  return Object.entries(models).reduce(
    (acc, [modelName, impl]) => {
      const { post, exe, pre, notImpl } = modelOpExtract({
        model: { name: modelName, impl },
        envelope,
        backModelEnvelopeDispatcher,
        loggerProvider,
      })
      post && acc.post.push({ fn: post, modelName })
      exe && acc.exe.push({ fn: exe, modelName })
      pre && acc.pre.push({ fn: pre, modelName })
      notImpl && acc.notImpl.push({ fn: notImpl, modelName })
      return acc
    },
    { post: [], pre: [], exe: [], notImpl: [] } as {
      exe: { modelName: string; fn: Exclude<modelExtraction['exe'], undefined> }[]
      pre: { modelName: string; fn: Exclude<modelExtraction['pre'], undefined> }[]
      post: { modelName: string; fn: Exclude<modelExtraction['post'], undefined> }[]
      notImpl: { modelName: string; fn: Exclude<modelExtraction['notImpl'], undefined> }[]
    },
  )
}

type modelOpExtractDeps = {
  model: { impl: any_; name: any_ }
  envelope: moo.model.envelope<any_>
  backModelEnvelopeDispatcher: moo.model.dispatcher<any_>
  loggerProvider: loggerProvider
}
type modelExtraction = ReturnType<typeof modelOpExtract>
export function modelOpExtract({ model, envelope, backModelEnvelopeDispatcher, loggerProvider }: modelOpExtractDeps) {
  const handle = modelHandleProxy({
    modelEnvelopeDispatcher: backModelEnvelopeDispatcher,
    origin: {
      from: {
        id: envelope.id,
        target: envelope.target,
      },
      gate: envelope.origin.gate,
    },
  })

  const withOpHandlers: undefined | moo.model.impl.withOpHandlers<any_> = envelope.target.path.reduce(
    (_model, prop) => (_model && '_' in _model && 'function' === typeof _model._ ? _model._(prop) : _model?.[prop]),
    model.impl,
  )
  const opHandlers = withOpHandlers?.$?.[envelope.target.opName]

  const exe = opHandlers?.exe // as undefined | moo.model.impl.exe<any_>
  const pre = opHandlers?.pre // as undefined | moo.model.impl.pre<any_>
  const post = opHandlers?.post // as undefined | moo.model.impl.post<any_>
  const notImpl = opHandlers?.notImpl // as undefined | moo.model.impl.notImpl<any_>
  const log = loggerProvider({ for: 'model', envelope: envelope })
  const now = new Date().toISOString()
  const ctx: moo.model.impl.ctx<any_> = {
    envelope: { ...envelope, now },
    log,
    now: new Date().toISOString(),
  }
  const exeArgs: moo.model.impl.exeArgs<any_> = [envelope.message, handle, ctx]
  return {
    exe: exe && (() => exe(...exeArgs)),
    pre: pre && (() => pre(...exeArgs)),
    notImpl: notImpl && (() => notImpl(...exeArgs)),
    post: post && ((outcome: Either<Error4xx, unknown>) => post(outcome, ...exeArgs)),
  }
}
