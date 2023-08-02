import { useCallback, useEffect } from 'react'
import { shell } from './shell.mjs'

type TaskResult<Awaiting> = TaskResolved<Awaiting> | TaskRejected | TaskAborted<Awaiting>
type TaskResolved<Awaiting> = {
  type: 'resolved'
  value: Awaiting
}
type TaskRejected = {
  type: 'rejected'
  reason: any
}
type TaskAborted<Awaiting> = {
  type: 'aborted'
  promise: Promise<Awaiting>
}
// type TaskPromise<Awaiting, Ctx> = Promise<TaskResult<Awaiting, Ctx>>
type Task<Awaiting, Ctx> = {
  id: string
  promise: Promise<Awaiting>
  ctx: Ctx
  resolver?: TaskResolver<Awaiting, Ctx>
}
type TaskResolver<Awaiting, Ctx> = (_: TaskResult<Awaiting> & { ctx: Ctx }) => void

type PendingTask<Awaiting, Ctx> = Task<Awaiting, Ctx>
export function createTasker<Awaiting, Ctx>() {
  const pendingTasks: Record<string, PendingTask<Awaiting, Ctx>> = {}
  return {
    setTask,
    setResolver,
    getTask,
    // resolveTask,
  }
  function getTask(id: string) {
    return pendingTasks[id]
  }

  function setResolver(id: string, resolver?: TaskResolver<Awaiting, Ctx>) {
    const currentPending = getTask(id)
    if (!currentPending) return false
    currentPending.resolver = resolver
    return true
  }

  function resolveTask(id: string, result: TaskResult<Awaiting>) {
    const currentPending = getTask(id)
    console.log('resolveTask', { result, currentPending })
    if (!currentPending) return false
    currentPending.resolver?.({ ...result, ctx: currentPending.ctx })
    delete pendingTasks[id]
    return true
  }

  function setTask(id: string, promise: Promise<Awaiting>, ctx: Ctx) {
    const currentPending = getTask(id)

    if (currentPending) {
      currentPending.resolver?.({
        type: 'aborted',
        promise: currentPending.promise,
        ctx: currentPending.ctx,
      })
      shell.abortRpc(currentPending.promise)
    }

    pendingTasks[id] = {
      id,
      promise,
      ctx,
    }
    promise
      .then(value => {
        if (getTask(id)?.promise !== promise) return
        resolveTask(id, { type: 'resolved', value })
      })
      .catch(reason => {
        if (getTask(id)?.promise !== promise) return
        resolveTask(id, { type: 'rejected', reason })
      })
    return pendingTasks[id]
  }
}

export function createTaskerHook<Awaiting, Ctx>() {
  const tasker = createTasker<Awaiting, Ctx>()
  return [useTasker] as const
  function useTasker(id: string, resolver: TaskResolver<Awaiting, Ctx>) {
    const setTask = useCallback(
      (promise: Promise<Awaiting>, ctx: Ctx) => {
        return tasker.setTask(id, promise, ctx)
      },
      [id],
    )
    useEffect(() => {
      tasker.setResolver(id, resolver)
      return () => {
        tasker.setResolver(id)
      }
    }, [id, resolver])
    const current = tasker.getTask(id)
    console.log({ current, id })
    return [setTask, current] as const
  }
}
