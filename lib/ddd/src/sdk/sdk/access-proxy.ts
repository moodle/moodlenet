import { createPathProxy } from '@moodle/lib-types'
import { ddd } from '../../domain'
import { domain_endpoint, domain_msg } from '../../types'

export const _inspect_symbol = Symbol('moduleAccessProxy inspect')

export type msg_domain_sender = (_: { domain_msg: domain_msg }) => unknown

export type access_proxy_ctrl = {
  sendDomainMsg: msg_domain_sender
}
export function create_access_proxy<domain extends ddd>(ctrl: access_proxy_ctrl): [domain] {
  const [domainProxy] = createPathProxy<domain>({
    apply({ arg, path }) {
      const endpoint = parseDomainEndpoint(path)
      const domain_msg: domain_msg = {
        endpoint,
        payload: arg,
      }

      return ctrl.sendDomainMsg({ domain_msg })
    },
  })
  return [domainProxy] as const
}

function parseDomainEndpoint(path: string[]): domain_endpoint {
  const [layer, module, channel, name] = path
  if (!layer || !module || !channel || !name) {
    throw new Error(`Invalid domain endpoint path: ${path.join('/')}`)
  }
  return {
    layer,
    module,
    channel,
    name,
  }
}
