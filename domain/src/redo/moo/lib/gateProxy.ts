import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'
import { Error4xx } from '../../../types'
import { messageDispatcher } from '../../lib/types'

const INSPECT_SYM = Symbol('GateProxy inspect symbol')

export function makeGateProxy({
  permissions,
  messageDispatcher,
  gateProvider,
}: {
  permissions: moo.permissions
  gateProvider: moo.Gate
  messageDispatcher: messageDispatcher
}) {
  return gateProxy(gateProvider, permissions, []) as unknown as moo.Gate<false>
  function gateProxy(_sub_gateProvider: any_, _sub_permissions: any_, path: string[]) {
    return new Proxy(() => null, {
      ...unsupportedProxyHandler,
      get(_target, prop) {
        if (prop === INSPECT_SYM) {
          return path
        }

        if (typeof prop !== 'string') {
          throw new TypeError(`GateProxy: Invalid property ${String(prop)}`)
        }

        const _next_sub_gateProvider = _sub_gateProvider[prop]
        const _next_sub_permissions = _sub_permissions[prop]
        const _next_path = [...path, prop]

        if (_next_path.length > 4) {
          throw new Error4xx(
            'Not Found',
            `
            GateProxy:
              unexistent gate path [${_next_path.join(',')}]
            `,
          )
        }

        if (_next_path.length < 4) {
          if (!_next_sub_permissions) {
            return undefined
          }

          if (!_next_sub_gateProvider) {
            throw new TypeError(`
              GateProxy:
                in path [${_next_path.join(',')}]
                _next_sub_permissions is defined ${_next_sub_permissions}
                but _next_sub_gateProvider is not ${_next_sub_gateProvider}
              `)
          }

          return gateProxy(_next_sub_gateProvider, _next_sub_permissions, _next_path)
        }

        // _next_path.length === 4 : endpoint|provider level

        if ('function' !== typeof _next_sub_gateProvider) {
          throw new TypeError(`
            GateProxy:
              _next_path.length === 4 [${_next_path.join(',')}]
              but _next_sub_gateProvider is not a function ${_next_sub_gateProvider}
            `)
        }

        const gate_Endpoint_Provider: moo.gate.endpointProvider<moo.model.type.endpointDef> = _next_sub_gateProvider
        const permissions_Endpoint: moo.permissions.Endpoint<moo.model.type.endpointDef> = _next_sub_permissions

        const directives = ((permissions_Endpoint as any_) ?? {})._

        const e_gate_enpoint = gate_Endpoint_Provider({ directives, permissions })
        if (isLeft(e_gate_enpoint)) {
          return undefined
        }
        const gate_endpoint: moo.Gate_Endpoint<any_, false> = {
          ...e_gate_enpoint.right,
          call: payload => messageDispatcher({ path: _next_path, payload }),
        }
        return gate_endpoint
      },
      apply(_target, _thisArg, [payload]) {
        return messageDispatcher({ path, payload })
      },
    })
  }
}
