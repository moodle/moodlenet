import { useCallback, useEffect } from 'react'

type TaskResult<Awaiting, Ctx> =
  | TaskResolved<Awaiting, Ctx>
  | TaskRejected<Ctx>
  | TaskAborted<Awaiting, Ctx>
type TaskResolved<Awaiting, Ctx> = {
  type: 'resolved'
  value: Awaiting
  ctx: Ctx
  id: string
}
type TaskRejected<Ctx> = {
  type: 'rejected'
  reason: any
  ctx: Ctx
  id: string
}
type TaskAborted<Awaiting, Ctx> = {
  type: 'aborted'
  promise: Promise<Awaiting>
  ctx: Ctx
  id: string
}
// type TaskPromise<Awaiting, Ctx> = Promise<TaskResult<Awaiting, Ctx>>
type Task<Awaiting, Ctx> = {
  id: string
  promise: Promise<Awaiting>
  ctx: Ctx
  resolve?: TaskResolve<Awaiting, Ctx>
  noUnloadConfim: boolean
}
type TaskResolve<Awaiting, Ctx> = (_: TaskResult<Awaiting, Ctx> & { ctx: Ctx }) => void

type PendingTask<Awaiting, Ctx> = Task<Awaiting, Ctx>
const pendingTasks = new Map<string, PendingTask<any, any>>()
window.addEventListener('unload', () => {
  for (const { promise, ctx, resolve, id } of pendingTasks.values()) {
    resolve?.({ type: 'aborted', promise, ctx, id })
  }
})
window.addEventListener('beforeunload', e => {
  const awaitingTasks = [...pendingTasks.values()].filter(({ noUnloadConfim }) => !noUnloadConfim)
  if (awaitingTasks.length) {
    e.returnValue = `there are ${awaitingTasks.length} pending tasks, are you sure to leave?`
    return e.returnValue
  }
})
function getTask(id: string) {
  return pendingTasks.get(id)
}

function setResolve<Awaiting, Ctx>(id: string, resolve?: TaskResolve<Awaiting, Ctx>) {
  const currentPending = getTask(id)
  if (!currentPending) return false
  currentPending.resolve = resolve
  return true
}
function setTask<Awaiting, Ctx>(
  id: string,
  promise: Promise<Awaiting>,
  ctx: Ctx,
  noUnloadConfim = false,
) {
  const currentPending = getTask(id)

  if (currentPending) {
    currentPending.resolve?.({
      type: 'aborted',
      id,
      promise: currentPending.promise,
      ctx: currentPending.ctx,
    })
  }

  const pendingTask: PendingTask<Awaiting, Ctx> = {
    id,
    promise,
    ctx,
    noUnloadConfim,
  }
  pendingTasks.set(id, pendingTask)
  promise
    .then(value => {
      const currentPending = getTask(id)
      if (currentPending?.promise !== promise) return
      currentPending.resolve?.({ type: 'resolved', id, value, ctx: currentPending.ctx })
      return currentPending
    })
    .catch(reason => {
      const currentPending = getTask(id)
      if (currentPending?.promise !== promise) return
      currentPending.resolve?.({ type: 'rejected', id, reason, ctx: currentPending.ctx })
      return currentPending
    })
    .then(currentPending => {
      currentPending && pendingTasks.delete(currentPending.id)
    })
    .catch(() => void 0)
  return pendingTask
}

export function createTaskManager<Awaiting, Ctx>(name = 'noname') {
  const bucketName = `${name}::${Math.random().toString(36).slice(2)}-${Date.now()}`
  return [useTasker] as const
  function useTasker(localId: string, resolve: TaskResolve<Awaiting, Ctx>) {
    const id = `${localId}@${bucketName}`
    const _setTask = useCallback(
      (promise: Promise<Awaiting>, ctx: Ctx) => {
        return setTask<Awaiting, Ctx>(id, promise, ctx)
      },
      [id],
    )
    useEffect(() => {
      setResolve(id, resolve)
      return () => {
        setResolve(id)
      }
    }, [id, resolve])
    const current = getTask(id) as PendingTask<Awaiting, Ctx>
    // console.log({ current, id })
    return [_setTask, id, current] as const
  }
}
