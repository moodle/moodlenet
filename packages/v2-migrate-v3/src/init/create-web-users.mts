import { createUser } from '@moodlenet/simple-email-auth/server'
import assert from 'assert'
// import cliProgress from 'cli-progress'
import type * as v2 from '../v2-types/v2.mjs'
import { v2_DB_ContentGraph, v2_DB_UserAuth } from './v2-db.mjs'

export const EmailUserIdMapping: Record<string, string> = {}
export const ProfileIdMapping: Record<string, string> = {}

const allProfilesCursor = await v2_DB_ContentGraph.query<v2.Profile>(
  `FOR p in Profile 
  RETURN p`,
  {},
  { count: true, batchSize: 100 },
)

// const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
// bar1.start(allProfilesCursor.count ?? 0, 0)
let count = 0
while (allProfilesCursor.hasNext) {
  // console.time('fetchNext')
  const v2_profile = await allProfilesCursor.next()
  // console.timeEnd('fetchNext')
  assert(v2_profile, 'NO PROFILE ?')
  // console.time(`create user ${v2_profile.name}`)

  // console.time('getUser')
  const v2_user = await (
    await v2_DB_UserAuth.query<v2.ActiveUser>(
      `FOR u IN User FILTER u.authId._authKey == "${v2_profile._authKey}" LIMIT 1 RETURN u`,
    )
  ).next()
  assert(v2_user, `NO USER FOR PROFILE ${v2_profile._key}`)
  // console.timeEnd('getUser')

  // bar1.update({ creatingUser: v2_user.email })

  // console.time('create Email User')
  const createEmailUserResp = await createUser({
    displayName: v2_profile.name,
    email: v2_user.email,
    hashedPassword: v2_user.password,
  })
  assert(createEmailUserResp.success)
  // console.timeEnd('create Email User')
  const { newProfile, newWebUser } = createEmailUserResp

  ProfileIdMapping[v2_profile._id] = newProfile._id
  EmailUserIdMapping[v2_user.id] = newWebUser._id
  // bar1.increment({ createdUser: v2_user.email })
  // console.timeEnd(`create user ${v2_profile.name}`)
  console.log(`done ${++count} users of ${allProfilesCursor.count} (${v2_user.email})`)
}
// declare const v2_profile: v2.Profile
// declare const v2_user: v2.ActiveUser
