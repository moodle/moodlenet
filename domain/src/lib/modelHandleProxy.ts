import { path, unsupportedProxyHandler } from '@moodle/lib-types'

export function modelHandleProxy({
  modelAccessDispatcher,
  origin,
}: {
  modelAccessDispatcher: moo.model.dispatcher
  origin: moo.model.access.origin
}): moo.model.handle {
  const model = subCoreModelHandleProxy({
    path: [],
    apply({ path }) {
      throw TypeError(`CoreModelHandleProxy: cannot apply model ${path}`)
    },
  }) as unknown as moo.model.handle['model']
  const over = _over as unknown as moo.model.handle['over']

  return {
    model,
    over,
  }

  function _over(modelRefProxy: () => { path: path; message: unknown[] }) {
    return subCoreModelHandleProxy({
      path: [],
      apply: ({ path: [opname, type], message }) => {
        if (!opname) {
          throw new TypeError(`CoreModelHandleProxy: Invalid opname ${opname}`)
        }
        if (!(type === 'query' || type === 'sync' || type === 'async')) {
          throw new TypeError(`CoreModelHandleProxy: Invalid action ${type}`)
        }

        const { path } = modelRefProxy()
        return modelAccessDispatcher({
          path,
          type,
          opname,
          message,
          ...origin,
        })
      },
    })
  }

  function subCoreModelHandleProxy({
    path,
    apply,
  }: {
    apply: (_: { path: path; message: unknown }) => void
    path: string[]
  }) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (typeof prop !== 'string') {
          throw new TypeError(`CoreModelHandleProxy: Invalid property ${String(prop)}`)
        }
        const _next_path = [...path, prop]

        return subCoreModelHandleProxy({ path: _next_path, apply })
      },
      apply(_target, _thisArg, args) {
        if (args.length > 1) {
          throw new TypeError(`CoreModelHandleProxy: Invalid args length ${args}`)
        }
        const [message] = args
        apply({ path, message })
      },
    })
  }
}
