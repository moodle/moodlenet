import { domain_session_access, domain_session_access_provider } from '@moodle/lib-ddd'
import { session_deployer } from './types'

const default_session_deployment: session_deployer = async ({
  access_session,
  domain_msg,
  core_factories,
  secondary_factories,
}) => {
  const deployment_domain_session_access: domain_session_access = domain_session_access_provider({
    core_factories,
    secondary_factories: secondary_factories,
    domain_session_access({ access_session, domain_msg }) {
      return deployment_domain_session_access({ access_session, domain_msg })
    },
  })
  return deployment_domain_session_access({ access_session, domain_msg })
}
export default default_session_deployment
