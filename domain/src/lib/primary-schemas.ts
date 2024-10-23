import { MoodleDomain } from '..'
import { getMoodleNetPrimarySchemas } from '../modules/env'
import { getuserAccountPrimarySchemas } from '../modules/user-account'
import { getOrgPrimarySchemas } from '../modules/org'
import { getUserProfilePrimarySchemas } from '../modules/user-profile'
import { AllSchemaConfigs } from '../types'

export function makeAllPrimarySchemas({
  userAccountSchemaConfigs,
  moodleNetSchemaConfigs,
  orgSchemaConfigs,
  uploadMaxSizeConfigs,
  userProfileSchemaConfigs,
}: AllSchemaConfigs) {
  const userAccount = getuserAccountPrimarySchemas(userAccountSchemaConfigs)
  const moodleNet = getMoodleNetPrimarySchemas(moodleNetSchemaConfigs)
  const org = getOrgPrimarySchemas(orgSchemaConfigs)
  const userProfile = getUserProfilePrimarySchemas(userProfileSchemaConfigs)
  return { userAccount, moodleNet, org, userProfile, uploadMaxSizeConfigs }
}

export async function fetchAllSchemaConfigs({ primary }: { primary: MoodleDomain['primary'] }): Promise<AllSchemaConfigs> {
  const [
    userAccountSchemaConfigs,
    userProfileSchemaConfigs,
    moodleNetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
  ] = await Promise.all([
    primary.userAccount.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.userProfile.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.net.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.org.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.storage.session.moduleInfo().then(({ uploadMaxSizeConfigs }) => uploadMaxSizeConfigs),
  ])
  return {
    userAccountSchemaConfigs,
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
