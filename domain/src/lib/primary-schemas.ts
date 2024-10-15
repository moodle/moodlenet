import { MoodleDomain } from '..'
import { getMoodleNetPrimarySchemas } from '../modules/env'
import { getIamPrimarySchemas } from '../modules/iam'
import { getOrgPrimarySchemas } from '../modules/org'
import { getUserHomePrimarySchemas } from '../modules/user-home'
import { AllSchemaConfigs } from '../types'

export function makeAllPrimarySchemas({
  iamSchemaConfigs,
  moodleNetSchemaConfigs,
  orgSchemaConfigs,
  uploadMaxSizeConfigs,
  userHomeSchemaConfigs,
}: AllSchemaConfigs) {
  const iam = getIamPrimarySchemas(iamSchemaConfigs)
  const moodleNet = getMoodleNetPrimarySchemas(moodleNetSchemaConfigs)
  const org = getOrgPrimarySchemas(orgSchemaConfigs)
  const userHome = getUserHomePrimarySchemas(userHomeSchemaConfigs)
  return { iam, moodleNet, org, userHome, uploadMaxSizeConfigs }
}

export async function fetchAllSchemaConfigs({
  primary,
}: {
  primary: MoodleDomain['primary']
}): Promise<AllSchemaConfigs> {
  const [
    iamSchemaConfigs,
    userHomeSchemaConfigs,
    moodleNetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
  ] = await Promise.all([
    primary.iam.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.userHome.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.net.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.org.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.storage.session.moduleInfo().then(({ uploadMaxSizeConfigs }) => uploadMaxSizeConfigs),
  ])
  return {
    iamSchemaConfigs,
    userHomeSchemaConfigs,
    moodleNetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
  }
}

export async function fetchAllPrimarySchemas({ primary }: { primary: MoodleDomain['primary'] }) {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
