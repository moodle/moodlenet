import { access } from './session-access'

export async function getSiteGeneralInfo() {
  const [{ info: moodlenet }, { info: org }] = await Promise.all([
    access.primary.moodlenet.session.moduleInfo(),
    access.primary.org.session.moduleInfo(),
  ])
  return { moodlenet, org }
}
