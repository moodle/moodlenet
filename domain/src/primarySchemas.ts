import { moodle_domain } from '.'
import { getMoodleNetPrimarySchemas, MoodleNetPrimaryMsgSchemaConfigs } from './env'
import { getIamPrimarySchemas, IamPrimaryMsgSchemaConfigs } from './iam'
import { getOrgPrimarySchemas, OrgPrimaryMsgSchemaConfigs } from './org'
import { uploadMaxSizeConfigs } from './storage'

export type AllSchemaConfigs = {
  iamSchemaConfigs: IamPrimaryMsgSchemaConfigs
  moodleNetSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
  orgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
  uploadMaxSizeConfigs: uploadMaxSizeConfigs
}

export type AllPrimarySchemas = ReturnType<typeof makeAllPrimarySchemas>
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
  primary: moodle_domain['primary']
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

export async function fetchAllPrimarySchemas({ primary }: { primary: moodle_domain['primary'] }) {
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary })
  return makeAllPrimarySchemas(allSchemaConfigs)
}
