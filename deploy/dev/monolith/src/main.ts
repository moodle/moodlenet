import { http_bind } from '@moodle/bindings/node'
import { coreDomain, createAcccessProxy, dispatch } from '@moodle/domain'
http_bind.server({
  access({ domain_msg, layer }) {
    const { mod } = createAcccessProxy({ access: console.log.bind(null, 'access') })
    const domain = coreDomain({ mod, primarySession: layer })
    return dispatch(domain, domain_msg)
  },
})
