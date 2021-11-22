import { Organization } from '@moodlenet/common/dist/content-graph/types/node'
import { Database } from 'arangojs'

export const createLocalOrg = async ({ db, org }: { db: Database; org: Organization }) => {
  console.log(`creating Local Organization ${org.name} @ ${org.domain}`)
  const aqlOrg: any = { ...org }
  delete aqlOrg._permId
  aqlOrg._key = org._permId
  await db.collection(org._type).save(aqlOrg)
}
