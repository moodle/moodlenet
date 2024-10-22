import { MoodleDomain } from '..'
import { getMoodleNetPrimarySchemas } from '../modules/env'
import { getIamPrimarySchemas } from '../modules/iam'
import { getOrgPrimarySchemas } from '../modules/org'
import { getUserProfilePrimarySchemas } from '../modules/user-profile'
import { AllSchemaConfigs } from '../types'

export function makeAllPrimarySchemas({
  iamSchemaConfigs,
  moodleNetSchemaConfigs,
  orgSchemaConfigs,
  uploadMaxSizeConfigs,
  userProfileSchemaConfigs,
}: AllSchemaConfigs) {
  const iam = getIamPrimarySchemas(iamSchemaConfigs)
  const moodleNet = getMoodleNetPrimarySchemas(moodleNetSchemaConfigs)
  const org = getOrgPrimarySchemas(orgSchemaConfigs)
  const userProfile = getUserProfilePrimarySchemas(userProfileSchemaConfigs)
  return { iam, moodleNet, org, userProfile, uploadMaxSizeConfigs }
}

export async function fetchAllSchemaConfigs({ primary }: { primary: MoodleDomain['primary'] }): Promise<AllSchemaConfigs> {
  const [iamSchemaConfigs, userProfileSchemaConfigs, moodleNetSchemaConfigs, orgSchemaConfigs, uploadMaxSizeConfigs] =
    await Promise.all([
      primary.iam.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.userProfile.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.net.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.org.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.storage.session.moduleInfo().then(({ uploadMaxSizeConfigs }) => uploadMaxSizeConfigs),
    ])
  return {
    iamSchemaConfigs,
    userProfileSchemaConfigs,
    moodleNetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
  }
}

export async function fetchAllPrimarySchemas({ primary }: { primary: MoodleDomain['primary'] }) {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
