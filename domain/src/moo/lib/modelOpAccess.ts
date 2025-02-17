import { any_ } from '@moodle/lib-types'
import { modelHandleProxy } from './modelHandleProxy'

export function modelOpAccess({
  modelImpl,
  access,
  backModelAccessDispatcher,
}: {
  modelImpl: any_
  access: moo.model.access
  backModelAccessDispatcher: moo.model.dispatcher
}) {
  const handle = modelHandleProxy({ modelAccessDispatcher: backModelAccessDispatcher })
  const typeModelImpl = access.path.reduce((_model, prop) => _model?.[prop], modelImpl)
  const exe = typeModelImpl?.[`* ${access.opname}`] as
    | undefined
    | ((message: unknown, handle: moo.model.handle) => Promise<unknown>)
  const or = typeModelImpl?.[`| ${access.opname}`] as
    | undefined
    | ((message: unknown, handle: moo.model.handle) => Promise<void>)
  const and = typeModelImpl?.[`= ${access.opname}`] as
    | undefined
    | ((outcome: unknown, message: unknown, handle: moo.model.handle) => Promise<void>)
  return {
    exe: exe && (() => exe(access.message, handle)),
    or: or && (() => or(access.message, handle)),
    and: and && ((outcome: unknown) => and(outcome, access.message, handle)),
  }
}
