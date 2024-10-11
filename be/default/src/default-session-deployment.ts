import {
  access_session,
  domain_endpoint,
  domain_session_access,
  domain_session_access_provider,
} from '@moodle/lib-ddd'
import { session_deployer } from './types'

const default_session_deployment: session_deployer = async ({
  access_session,
  domain_msg,
  core_factories,
  secondary_factories,
  start_background_processes,
}) => {
  const deployment_domain_session_access: domain_session_access = domain_session_access_provider({
    core_factories,
    secondary_factories: secondary_factories,
    domain_session_access({ access_session, domain_msg }) {
      return deployment_domain_session_access({ access_session, domain_msg })
    },
  })
  if (start_background_processes) {
    await startBackgroundProcesses()
  }
  return deployment_domain_session_access({ access_session, domain_msg })

  async function startBackgroundProcesses() {
    // BEWARE:these messages are manually crafted: no type-checking here
    // and should be maintained aligned with domain modules's event.env.system.backgroundProcess handler
    // at least until we have a better way to generate them

    // FIXME: after removed event layer must find another way to trigger this kind of events...
    // Maybe restoring the former event layer, in addition to the current (renaming it to e.g. "listener" ?)
    const bg_proc_domain_endpoint: domain_endpoint = {
      layer: 'event',
      module: 'env',
      channel: 'system',
      name: 'backgroundProcess',
    }

    const bg_proc_access_session: access_session = {
      id: {
        type: 'background-process',
        domain: access_session.domain,
      },
      type: 'system',
      domain: access_session.domain,
      from: bg_proc_domain_endpoint,
    }

    await deployment_domain_session_access({
      access_session: bg_proc_access_session,
      domain_msg: {
        endpoint: bg_proc_domain_endpoint,
        payload: { action: 'start' },
      },
    })
    process.on('exit', () => {
      //FIXME: firing an event is an asynchronous operation
      // this event will never be handled by cores for eventual cleanups before exit
      // that's by nodejs design for 'exit' event
      // we should consider using some other event: possibly 'SIGINT' or 'SIGTERM'
      deployment_domain_session_access({
        access_session: bg_proc_access_session,
        domain_msg: {
          endpoint: bg_proc_domain_endpoint,
          payload: { action: 'stop' },
        },
      })
    })
  }
}
export default default_session_deployment
