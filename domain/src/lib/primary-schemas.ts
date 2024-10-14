import { AllSchemaConfigs, MoodleDomain } from '..'
import { getMoodleNetPrimarySchemas } from '../modules/env'
import { getIamPrimarySchemas } from '../modules/iam'
import { getOrgPrimarySchemas } from '../modules/org'

export function makeAllPrimarySchemas({
  iamSchemaConfigs,
  moodleNetSchemaConfigs,
  orgSchemaConfigs,
}: AllSchemaConfigs) {
  const iam = getIamPrimarySchemas(iamSchemaConfigs)
  const moodleNet = getMoodleNetPrimarySchemas(moodleNetSchemaConfigs)
  const org = getOrgPrimarySchemas(orgSchemaConfigs)
  return { iam, moodleNet, org }
}

export async function fetchAllSchemaConfigs({
  primary,
}: {
  primary: MoodleDomain['primary']
}): Promise<AllSchemaConfigs> {
  const [iamSchemaConfigs, moodleNetSchemaConfigs, orgSchemaConfigs, uploadMaxSizeConfigs] =
    await Promise.all([
      primary.iam.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.net.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.org.session.moduleInfo().then(({ schemaConfigs }) => schemaConfigs),
      primary.storage.session.moduleInfo().then(({ uploadMaxSizeConfigs }) => uploadMaxSizeConfigs),
    ])
  return { iamSchemaConfigs, moodleNetSchemaConfigs, orgSchemaConfigs, uploadMaxSizeConfigs }
}

export async function fetchAllPrimarySchemas({ primary }: { primary: MoodleDomain['primary'] }) {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
