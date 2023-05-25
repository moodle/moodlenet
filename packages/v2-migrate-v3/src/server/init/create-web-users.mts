import { createUser } from '@moodlenet/simple-email-auth/server'
import assert from 'assert'
import cliProgress from 'cli-progress'
import type * as v2 from '../v2-types/v2.mjs'
import { v2_DB_ContentGraph, v2_DB_UserAuth } from './v2-db.mjs'
export const BAR = new cliProgress.SingleBar(
  { format: '{bar} {percentage}% | {value}/{total} Users | creating: {email}' },
  cliProgress.Presets.shades_grey,
)

export const EmailUserIdMapping: Record<string, string> = {}
export const ProfileIdMapping: Record<string, string> = {}

const allProfilesCursor = await v2_DB_ContentGraph.query<v2.Profile>(
  `FOR p in Profile 
  RETURN p`,
  {},
  { count: true, batchSize: 100 },
)

BAR.start(allProfilesCursor.count ?? 0, 0)
while (allProfilesCursor.hasNext) {
  const v2_profile = await allProfilesCursor.next()
  assert(v2_profile, 'NO PROFILE ?')

  const v2_user = await (
    await v2_DB_UserAuth.query<v2.ActiveUser>(
      `FOR u IN User FILTER u.authId._authKey == "${v2_profile._authKey}" LIMIT 1 RETURN u`,
    )
  ).next()
  assert(v2_user, `NO USER FOR PROFILE ${v2_profile._key}`)

  BAR.update({ email: v2_user.email })

  const createEmailUserResp = await createUser({
    displayName: v2_profile.name,
    email: v2_user.email,
    hashedPassword: v2_user.password,
  })
  assert(createEmailUserResp.success)
  const { newProfile, newWebUser } = createEmailUserResp

  ProfileIdMapping[v2_profile._id] = newProfile._id
  EmailUserIdMapping[v2_user.id] = newWebUser._id
  BAR.increment()
}
