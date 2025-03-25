import { generateUlid } from '@moodle/lib-id-gen'
import { any_, path, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export function modelHandleProxy({ modelDispatcher, origin }: { modelDispatcher: moo.def.model.dispatcher<any_>; origin: moo.def.model.envelope.origin }): moo.def.model.handle {
  const model = subCoreModelHandleProxy({
    path: [],
    apply: ({ fullPath, message }) => {
      const revFullPath = fullPath.slice().reverse()
      const [opType, ...revPath] = revFullPath
      const path = revPath.reverse()
      if (!(opType === 'query' || opType === 'sync' || opType === 'async')) {
        throw new TypeError(`CoreModelHandleProxy: Invalid action ${opType}`)
      }
      // console.log({ _modelRefProxy: modelRefProxy(), modelRefProxy })

      const now = new Date().toISOString()
      const id = generateUlid({ onDate: now })
      return modelDispatcher({
        id,
        now: now,
        callTime: now,
        path,
        opType,
        origin,
        message,
      }).then(outcome => (isLeft(outcome) ? Promise.reject(outcome.left) : outcome.right))
    },
  }) as unknown as moo.def.model.handle

  return model
}

function subCoreModelHandleProxy({ path, apply }: { apply: (_: { fullPath: path; message: unknown }) => void; path: string[] }) {
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
      return apply({ fullPath: path, message })
    },
  })
}

