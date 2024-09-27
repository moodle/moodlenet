import { _any, deep_partial } from '@moodle/lib-types'
import { inspect } from 'util'
import {
  access_session,
  composeImpl,
  concrete,
  core_factory,
  CoreContext,
  coreModId,
  domain_msg,
  EvtContext,
  layer_contexts,
  sec_factory,
  SecondaryContext,
} from '../../types'
import { createAcccessProxy } from './access-proxy'

export async function domainSessionAccess({
  access_session,
  domain_msg: current_domain_msg,
  core_factories,
  sec_factories,
}: {
  access_session: access_session
  domain_msg: domain_msg
  core_factories: core_factory[]
  sec_factories: sec_factory[]
}) {
  const forwardAccessProxy = createAcccessProxy({
    access(forwardAccessPayload) {
      return domainSessionAccess({
        domain_msg: forwardAccessPayload.domain_msg,
        access_session,
        core_factories,
        sec_factories,
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

  const sysCallAccessProxy = createAcccessProxy({
    access(sysCallAccessPayload) {
      const sys_call_core_mod_id = coreModId(current_domain_msg)
      const sysCallAccessSession: access_session = {
        type: 'system',
        domain: access_session.domain,
        mod_id: sys_call_core_mod_id,
      }

      return domainSessionAccess({
        domain_msg: sysCallAccessPayload.domain_msg,
        access_session: sysCallAccessSession,
        core_factories,
        sec_factories,
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

  // console.log(inspect(moodleDomain, true, 10, true))
  if (current_domain_msg.layer === 'pri') {
    const coreCtx: CoreContext = {
      access_session,
      forward: forwardAccessProxy.mod,
      sys_call: sysCallAccessProxy.mod,
      pri_domain_msg: current_domain_msg,
    }
    const core_impls = await Promise.all(core_factories.map(core_factory => core_factory(coreCtx)))
    const core = composeImpl(...core_impls)
    return dispatch(core, current_domain_msg)
  } else if (current_domain_msg.layer === 'sec') {
    if (access_session.type !== 'system') {
      throw TypeError(`only system session can call sec layer`)
    }
    const secondaryCtx: SecondaryContext = {
      sys_call: sysCallAccessProxy.mod,
      access_session,
      emit: sysCallAccessProxy.mod,
      invoked_by: access_session.mod_id,
      sec_domain_msg: current_domain_msg,
      // pri_domain_msg,
    }

    const sec_impls = await Promise.all(sec_factories.map(sec_factory => sec_factory(secondaryCtx)))
    const sec = composeImpl(...sec_impls)
    return dispatch(sec, current_domain_msg)
  } else if (current_domain_msg.layer === 'evt') {
    if (access_session.type !== 'system') {
      throw TypeError(`only system session can call evt layer`)
    }

    const evtContext: EvtContext = {
      sys_call: sysCallAccessProxy.mod,
      forward: forwardAccessProxy.mod,
      access_session: access_session,
      evt_domain_msg: current_domain_msg,
      // pri_domain_msg,
      // sec_domain_msg,
    }
    const core_impls = await Promise.all(
      core_factories.map(core_factory => core_factory(evtContext)),
    )

    core_impls.forEach(core_factory => {
      dispatch(core_factory, current_domain_msg)
    })
  } else {
    throw TypeError(`unknown msg layer: ${current_domain_msg.layer}`)
  }

  function dispatch(
    modules: deep_partial<concrete<keyof layer_contexts>>,
    { ns, mod, version, layer, channel, port, payload }: domain_msg,
  ) {
    //TODO: check version compatibility if exact version not found
    const access = (modules as _any)?.[ns]?.[mod]?.[version]?.[layer]?.[channel]?.[port]

    if (typeof access !== 'function') {
      const err_msg = `
      NOT IMPLEMENTED: ${ns}.${mod}.${version}.${layer}.${channel}.${port}
      FOUND: ${inspect(access, { colors: true, showHidden: true, depth: 10 })}
      `
      throw TypeError(err_msg)
    }
    return access(payload)
  }
}
