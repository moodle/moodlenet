import { createUser } from '@moodlenet/simple-email-auth/server'
import { editProfile } from '@moodlenet/web-user/server'
import assert from 'assert'
import cliProgress from 'cli-progress'
import { shell } from '../shell.mjs'
import type * as v2 from '../v2-types/v2.mjs'
import { initiateCallForProfileKey } from './util.mjs'
import { v2_DB_ContentGraph, v2_DB_UserAuth } from './v2-db.mjs'

export const EmailUser_v2v3_IdMapping: Record<string, string> = {}
export const Profile_v2v3_IdMapping: Record<string, string> = {}
export const EmailUser_v3v2_IdMapping: Record<string, string> = {}
export const Profile_v3v2_IdMapping: Record<string, string> = {}

export async function user_profiles() {
  const BAR = new cliProgress.SingleBar(
    {
      format:
        '{bar} {percentage}% | {value}/{total} {eta_formatted} | creating user | {email} [{status}]',
    },
    cliProgress.Presets.shades_grey,
  )

  const allProfilesCursor = await v2_DB_ContentGraph.query<v2.Profile>(
    `
      FOR p in Profile
      RETURN p
    `,
    // `
    // FOR pp IN UNION_DISTINCT(
    //   FOR p in Profile
    //     FILTER p._published
    //     LIMIT 0, 50
    //   RETURN p
    //   ,[
    //       Document("Profile/qFrZA4VJ8ba4uvkmEPxp8DpGeCofKS" /* alec */),
    //       Document("Profile/Wn4IUjm2K2PFwoKFsC0xByxYlPcykg" /* etto */),
    //       Document("Profile/KiL7cfGqzRGDi9mG7M7AARXl4zQKtW" /* Bru 1*/),
    //       Document("Profile/IOz4Q52ddl1JleKwHIrrhrLucz1A30" /* Bru 2*/)
    //    ])
    // return pp`,
    {},
    { count: true, batchSize: 100 },
  )

  BAR.start(allProfilesCursor.count ?? 0, 0)
  while (allProfilesCursor.hasNext) {
    const v2_profile = await allProfilesCursor.next()
    assert(v2_profile, `NO PROFILE FROM QUERY CAN'T HAPPEN`)

    const v2_user = await (
      await v2_DB_UserAuth.query<v2.ActiveUser>(
        `FOR u IN User FILTER u.authId._authKey == "${v2_profile._authKey}" LIMIT 1 RETURN u`,
      )
    ).next()
    assert(v2_user, `NO USER FOR PROFILE ${v2_profile._key}`)
    const email = v2_user.email
    BAR.update({ email, status: 'creating' })
    const { newProfile, newWebUser } = await shell.initiateCall(async () => {
      shell.setNow(v2_profile._created)

      const createEmailUserResp = await createUser({
        displayName: v2_profile.name,
        email,
        hashedPassword: v2_user.password,
      })
      assert(createEmailUserResp.success)
      return createEmailUserResp
    })

    await initiateCallForProfileKey({
      _id: newProfile._id,
      async exec() {
        await editProfile(newProfile._key, {
          aboutMe: v2_profile.description,
          siteUrl: v2_profile.siteUrl,
          location: v2_profile.location,
        })
      },
    })
    Profile_v2v3_IdMapping[v2_profile._id] = newProfile._id
    EmailUser_v2v3_IdMapping[v2_user.id] = newWebUser._id
    Profile_v3v2_IdMapping[newProfile._id] = v2_profile._id
    EmailUser_v3v2_IdMapping[newWebUser._id] = v2_user.id
    BAR.increment()
  }
  BAR.stop()
}
