import { moodlePrimary } from '..'
import { getMoodlenetPrimarySchemas } from '../modules/env'
import { getOrgPrimarySchemas } from '../modules/org'
import { getuserAccountPrimarySchemas } from '../modules/user-account'
import { getUserProfilePrimarySchemas } from '../modules/user-profile'
import { getEduPrimarySchemas } from '../modules/edu'
import { AllSchemaConfigs } from '../types'

//FIXME: move all this stuff in moodlenet-react-app ! for the moment it's used there, and it makes sense cause that is (and should be) the only know-all place (as well as other apps, but eventually they will t=do their own)
export function makeAllPrimarySchemas({
  userAccountSchemaConfigs,
  moodlenetSchemaConfigs,
  orgSchemaConfigs,
  uploadMaxSizeConfigs,
  userProfileSchemaConfigs,
  eduSchemaConfigs,
}: AllSchemaConfigs) {
  const userAccount = getuserAccountPrimarySchemas(userAccountSchemaConfigs)
  const moodlenet = getMoodlenetPrimarySchemas(moodlenetSchemaConfigs)
  const org = getOrgPrimarySchemas(orgSchemaConfigs)
  const userProfile = getUserProfilePrimarySchemas(userProfileSchemaConfigs)
  const edu = getEduPrimarySchemas(eduSchemaConfigs)
  return { edu, userAccount, moodlenet, org, userProfile, uploadMaxSizeConfigs }
}

export async function fetchAllSchemaConfigs({ primary }: { primary: moodlePrimary }): Promise<AllSchemaConfigs> {
  const [
    userAccountSchemaConfigs,
    userProfileSchemaConfigs,
    moodlenetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
    eduSchemaConfigs,
  ] = await Promise.all([
    primary.userAccount.anyUser.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.userProfile.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.moodlenet.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.org.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
    primary.storage.session.moduleInfo().then(({ uploadMaxSizeConfigs }) => uploadMaxSizeConfigs),
    primary.edu.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
  ])
  return {
    userAccountSchemaConfigs,
    userProfileSchemaConfigs,
    moodlenetSchemaConfigs,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
    eduSchemaConfigs,
  }
}

export async function fetchAllPrimarySchemas({ primary }: { primary: moodlePrimary }) {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
