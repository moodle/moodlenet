import { access } from './session-access'

export async function getSiteGeneralInfo() {
  const [{ info: moodlenet }, { info: org }] = await Promise.all([access.gate.moodlenet.session.moduleInfo(), access.gate.org.session.moduleInfo()])
  return { moodlenet, org }
}
