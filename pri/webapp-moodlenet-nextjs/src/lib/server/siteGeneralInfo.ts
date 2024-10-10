import { priAccess } from './session-access'

export async function getSiteGeneralInfo() {
  const [{ info: net }, { info: org }] = await Promise.all([
    priAccess().net.session.moduleInfo(),
    priAccess().org.session.moduleInfo(),
  ])
  return { net, org }
}
