import { moodlePrimary } from '..'
import { getMoodlenetPrimarySchemas } from '../modules/env'
import { getOrgPrimarySchemas } from '../modules/org'
import { getUserAccountPrimarySchemas } from '../modules/user-account'
import { getUserProfilePrimarySchemas } from '../modules/user-profile'
import { getEduPrimarySchemas } from '../modules/edu'
import { AllSchemaConfigs } from '../types'
import { merge as deepMerge } from 'lodash'

//FIXME: move all this stuff in moodlenet-react-app ! for the moment it's used there, and it makes sense cause that is (and should be) the only know-all place (as well as other apps, but eventually they will t=do their own)
export function makeAllPrimarySchemas({
  userAccountSchemaConfigs,
  moodlenetSchemaConfigs,
  orgSchemaConfigs,
  uploadMaxSizeConfigs,
  userProfileSchemaConfigs,
  eduSchemaConfigs,
  enabledCategoriesSchemaConfigs,
  eduPublishSchemaConfigs,
}: AllSchemaConfigs) {
  const userAccount = getUserAccountPrimarySchemas(userAccountSchemaConfigs)
  const moodlenet = getMoodlenetPrimarySchemas(moodlenetSchemaConfigs)
  const org = getOrgPrimarySchemas(orgSchemaConfigs)
  const userProfile = getUserProfilePrimarySchemas(userProfileSchemaConfigs)
  const edu = getEduPrimarySchemas(eduSchemaConfigs, enabledCategoriesSchemaConfigs)
  const eduPublish = getEduPrimarySchemas(eduPublishSchemaConfigs, enabledCategoriesSchemaConfigs)
  return { edu, eduPublish, eduPublishSchemaConfigs, userAccount, moodlenet, org, userProfile, uploadMaxSizeConfigs }
}

export async function fetchAllSchemaConfigs({ primary }: { primary: moodlePrimary }): Promise<AllSchemaConfigs> {
  const [userAccountSchemaConfigs, userProfileSchemaConfigs, moodlenet, orgSchemaConfigs, uploadMaxSizeConfigs, edu] =
    await Promise.all([
      primary.userAccount.anyUser.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.userProfile.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.moodlenet.session.moduleInfo().then(({ schemaConfigs, eduPublishPrimaryMsgSchemaConfigOverrides }) => ({
        schemaConfigs,
        eduPublishPrimaryMsgSchemaConfigOverrides,
      })),
      primary.org.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.storage.session.moduleInfo().then(({ configs: { uploadMaxSize } }) => uploadMaxSize),
      primary.edu.session
        .moduleInfo()
        .then(({ schemaConfigs, enabledCategoriesSchemaConfigs }) => ({ schemaConfigs, enabledCategoriesSchemaConfigs })),
    ])
  return {
    userAccountSchemaConfigs,
    userProfileSchemaConfigs,
    moodlenetSchemaConfigs: moodlenet.schemaConfigs,
    eduPublishPrimaryMsgSchemaConfigOverrides: moodlenet.eduPublishPrimaryMsgSchemaConfigOverrides,
    orgSchemaConfigs,
    uploadMaxSizeConfigs,
    eduSchemaConfigs: edu.schemaConfigs,
    enabledCategoriesSchemaConfigs: edu.enabledCategoriesSchemaConfigs,
    eduPublishSchemaConfigs: deepMerge({}, edu.schemaConfigs, moodlenet.eduPublishPrimaryMsgSchemaConfigOverrides),
  }
}

export async function fetchAllPrimarySchemas({ primary }: { primary: moodlePrimary }) {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
