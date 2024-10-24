import { MoodleDomain } from '..'
import { getMoodlenetPrimarySchemas } from '../modules/env'
import { getuserAccountPrimarySchemas } from '../modules/user-account'
import { getOrgPrimarySchemas } from '../modules/org'
import { getUserProfilePrimarySchemas } from '../modules/user-profile'
import { AllSchemaConfigs } from '../types'

export function makeAllPrimarySchemas({
  userAccountSchemaConfigs,
  moodlenetSchemaConfigs,
  orgSchemaConfigs,
  uploadMaxSizeConfigs,
  userProfileSchemaConfigs,
}: AllSchemaConfigs) {
  const userAccount = getuserAccountPrimarySchemas(userAccountSchemaConfigs)
  const moodlenet = getMoodlenetPrimarySchemas(moodlenetSchemaConfigs)
  const org = getOrgPrimarySchemas(orgSchemaConfigs)
  const userProfile = getUserProfilePrimarySchemas(userProfileSchemaConfigs)
  return { userAccount, moodlenet, org, userProfile, uploadMaxSizeConfigs }
}

export async function fetchAllSchemaConfigs({ primary }: { primary: MoodleDomain['primary'] }): Promise<AllSchemaConfigs> {
  const [
    userAccountSchemaConfigs,
    userProfileSchemaConfigs,
    moodlenetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
  ] = await Promise.all([
    primary.userAccount.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.userProfile.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.moodlenet.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.org.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.storage.session.moduleInfo().then(({ uploadMaxSizeConfigs }) => uploadMaxSizeConfigs),
  ])
  return {
    userAccountSchemaConfigs,
    userProfileSchemaConfigs,
    moodlenetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
  }
}

export async function fetchAllPrimarySchemas({ primary }: { primary: MoodleDomain['primary'] }) {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
