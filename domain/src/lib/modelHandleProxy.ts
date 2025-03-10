import { generateUlid } from '@moodle/lib-id-gen'
import { any_, path, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export function modelHandleProxy({
  modelEnvelopeDispatcher: modelAccessDispatcher,
  origin,
}: {
  modelEnvelopeDispatcher: moo.model.dispatcher<any_>
  origin: moo.model.envelope.origin
}): moo.model.handle {
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
      return modelAccessDispatcher({
        id,
        now: now,
        callTime: now,
        target: {
          path,
          opType,
        },
        origin,
        message,
      }).then(outcome => (isLeft(outcome) ? Promise.reject(outcome.left) : outcome.right))
    },
  }) as unknown as moo.model.handle

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

