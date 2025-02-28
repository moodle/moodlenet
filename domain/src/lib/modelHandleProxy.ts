import { generateUlid } from '@moodle/lib-id-gen'
import { path, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

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
      return { path }
      // throw TypeError(`CoreModelHandleProxy: cannot apply model ${path}`)
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
      apply: ({ path: [opName, type], message }) => {
        if (!opName) {
          throw new TypeError(`CoreModelHandleProxy: Invalid opname ${opName}`)
        }
        if (!(type === 'query' || type === 'sync' || type === 'async')) {
          throw new TypeError(`CoreModelHandleProxy: Invalid action ${type}`)
        }
        // console.log({ _modelRefProxy: modelRefProxy(), modelRefProxy })

        const { path } = modelRefProxy()
        const now = new Date().toISOString()
        const id = generateUlid({ onDate: now })
        return modelAccessDispatcher({
          id,
          now: now,
          callTime: now,
          target: {
            opName,
            path,
            type,
          },
          origin,
          message,
        }).then(outcome => (isLeft(outcome) ? Promise.reject(outcome.left) : outcome.right))
      },
    })
  }

  function subCoreModelHandleProxy({ path, apply }: { apply: (_: { path: path; message: unknown }) => void; path: string[] }) {
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
        return apply({ path, message })
      },
    })
  }
}
