import { primary } from './session-access'

export async function getSiteGeneralInfo() {
  const [{ info: net }, { info: org }] = await Promise.all([
    primary.moodle.net.session.moduleInfo(),
    primary.moodle.org.session.moduleInfo(),
  ])
  return { net, org }
}
