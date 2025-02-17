import { any_ } from '@moodle/lib-types'
import { loggerProvider } from '../types/log'
import { modelHandleProxy } from './modelHandleProxy'

export function modelOpAccess({
  modelImpl,
  access,
  backModelAccessDispatcher,
  loggerProvider,
}: {
  modelImpl: any_
  access: moo.model.access<any_>
  backModelAccessDispatcher: moo.model.dispatcher
  loggerProvider: loggerProvider
}) {
  const handle = modelHandleProxy({
    modelAccessDispatcher: backModelAccessDispatcher,
    origin: {
      fromModel: { opPath: access.path },
      useCase: access.useCase,
    },
  })
  const typeModelImpl = access.path.reduce((_model, prop) => _model?.[prop], modelImpl)
  const exe = typeModelImpl?.[`* ${access.opname}`] as undefined | moo.model.impl.exe<any_>
  const or = typeModelImpl?.[`| ${access.opname}`] as undefined | moo.model.impl.or<any_>
  const and = typeModelImpl?.[`= ${access.opname}`] as undefined | moo.model.impl.and<any_>
  const log = loggerProvider({ $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$: 1 })
  const ctx: moo.model.impl.ctx<any_> = { ...access, log, handle }
  return {
    exe: exe && (() => exe(ctx)),
    or: or && (() => or(ctx)),
    and: and && ((outcome: unknown) => and(outcome, ctx)),
  }
}
