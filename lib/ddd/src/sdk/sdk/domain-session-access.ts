import { _any } from '@moodle/lib-types'
import { inspect } from 'util'
import { ddd } from '../../domain'
import {
  access_session,
  composeDomains,
  core_factory,
  core_impl,
  CoreContext,
  domain_msg,
  EvtContext,
  secondary_adapter,
  secondary_factory,
  SecondaryContext,
} from '../../types'
import { create_access_proxy } from './access-proxy'

export type domain_session_access_deps = {
  access_session: access_session
  domain_msg: domain_msg
}

export type domain_session_access = (_: domain_session_access_deps) => Promise<_any>
export type domain_session_access_provider_deps<domain extends ddd> = {
  core_factories: core_factory<domain>[]
  secondary_factories: secondary_factory<domain>[]
  domain_session_access: domain_session_access
}

export function domain_session_access_provider<domain extends ddd>({
  core_factories,
  secondary_factories,
  domain_session_access,
}: domain_session_access_provider_deps<domain>): domain_session_access {
  return async ({ access_session, domain_msg: current_domain_msg }) => {
    // current_domain_msg.endpoint.layer === 'event' &&
    //   console.log(`domain_session_access_provider`, { access_session, current_domain_msg })
    const [forwardAccessProxy] = create_access_proxy({
      sendDomainMsg(forwardAccessPayload) {
        return domain_session_access({
          domain_msg: forwardAccessPayload.domain_msg,
          access_session,
        }).catch(forwardAccessProxyError => {
          console.error(
            `forwardAccessProxy Error`,
            inspect(
              { forwardAccessPayload, forwardAccessProxyError },
              { colors: true, depth: 10, showHidden: true },
            ),
            forwardAccessProxyError instanceof Error ? forwardAccessProxyError.stack : '',
          )
          throw forwardAccessProxyError
        })
      },
    })

    const [sysCallAccessProxy] = create_access_proxy({
      sendDomainMsg(sysCallAccessPayload) {
        const sysCallAccessSession: access_session = {
          type: 'system',
          domain: access_session.domain,
          from: sysCallAccessPayload.domain_msg.endpoint,
        }

        return domain_session_access({
          domain_msg: sysCallAccessPayload.domain_msg,
          access_session: sysCallAccessSession,
        }).catch(sysCallAccessProxyError => {
          console.error(
            `sysCallAccessProxy Error`,
            inspect(
              { sysCallAccessPayload, sysCallAccessProxyError },
              { colors: true, depth: 10, showHidden: true },
            ),
            sysCallAccessProxyError instanceof Error ? sysCallAccessProxyError.stack : '',
          )
          throw sysCallAccessProxyError
        })
      },
    })
    if (current_domain_msg.endpoint.layer === 'primary') {
      const coreCtx: CoreContext<domain> = {
        access_session,
        forward: forwardAccessProxy,
        sys_call: sysCallAccessProxy,
      }
      const core_impls = await Promise.all(
        core_factories.map(core_factory => core_factory(coreCtx)),
      )
      const core = composeDomains<domain>(core_impls)
      return dispatch(core, current_domain_msg)
    } else if (current_domain_msg.endpoint.layer === 'secondary') {
      if (access_session.type !== 'system') {
        throw TypeError(`only system session can call sec layer`)
      }
      const secondaryCtx: SecondaryContext<domain> = {
        sys_call: sysCallAccessProxy,
        access_session,
        emit: sysCallAccessProxy,
        invoked_by: access_session.from,
      }

      const sec_adapters = await Promise.all(
        secondary_factories.map(sec_factory => sec_factory(secondaryCtx)),
      )
      const sec = composeDomains<domain>(sec_adapters)
      const secondaryResult = await dispatch(sec, current_domain_msg)

      const evtContext: EvtContext<domain> = {
        sys_call: sysCallAccessProxy,
        forward: forwardAccessProxy,
        access_session: access_session,
      }
      core_factories
        .map(core_factory => core_factory(evtContext))
        .map(core => {
          dispatch(
            core.watch,
            {
              endpoint: current_domain_msg.endpoint,
              payload: [secondaryResult, current_domain_msg.payload],
            },
            { graceful: true },
          )
        })

      return secondaryResult
    } else if (current_domain_msg.endpoint.layer === 'event') {
      if (access_session.type !== 'system') {
        throw TypeError(`only system session can call evt layer`)
      }

      const evtContext: EvtContext<domain> = {
        sys_call: sysCallAccessProxy,
        forward: forwardAccessProxy,
        access_session: access_session,
      }
      const core_impls = await Promise.all(
        core_factories.map(core_factory => core_factory(evtContext)),
      )
      await Promise.all(
        core_impls.map(core_impl => dispatch(core_impl, current_domain_msg, { graceful: true })),
      )
    } else {
      console.error({ current_domain_msg })
      throw TypeError(`unknown msg layer: ${current_domain_msg.endpoint.layer}`)
    }
    type dispatch_opts = { graceful?: boolean }
    async function dispatch(
      impl: _any, // core_impl<domain> | secondary_adapter<domain> | watcher<>,
      domain_msg: domain_msg,
      opts?: dispatch_opts,
    ) {
      // console.log({ impl, domain_msg, opts })
      const { layer, module, channel, name } = domain_msg.endpoint
      const endpoint_impl = impl?.[layer]?.[module]?.[channel]?.[name]

      if (typeof endpoint_impl !== 'function') {
        if (opts?.graceful) {
          return
        }
        const err_msg = `
      NOT IMPLEMENTED: ${Object.entries(domain_msg.endpoint)}
      FOUND: ${inspect(endpoint_impl, { colors: true, showHidden: true, depth: 10 })}
      `
        throw TypeError(err_msg)
      }
      return endpoint_impl(domain_msg.payload)
    }
  }

}
