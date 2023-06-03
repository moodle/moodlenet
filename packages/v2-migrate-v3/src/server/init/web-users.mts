import { createSimpleEmailUser } from '@moodlenet/simple-email-auth/server'
import {
  editProfile,
  setProfileAvatar,
  setProfileBackgroundImage,
} from '@moodlenet/web-user/server'
import assert from 'assert'
import cliProgress from 'cli-progress'
import { shell } from '../shell.mjs'
import type * as v2 from '../v2-types/v2.mjs'
import { getRpcFileByV2AssetLocation, initiateCallForProfileKey } from './util.mjs'
import { v2_DB_ContentGraph, v2_DB_UserAuth } from './v2-db.mjs'

export const EmailUser_v2v3_IdMapping: Record<string, string> = {}
export const Profile_v2v3_IdMapping: Record<string, string> = {}
export const EmailUser_v3v2_IdMapping: Record<string, string> = {}
export const Profile_v3v2_IdMapping: Record<string, string> = {}

export async function user_profiles() {
  const BAR = new cliProgress.SingleBar(
    {
      format:
        '{bar} {percentage}% | {value}/{total} {duration_formatted}/{eta_formatted} | creating user | {email} [{status}]',
    },
    cliProgress.Presets.shades_grey,
  )

  const allProfilesCursor = await v2_DB_ContentGraph.query<v2.Profile | v2.Organization>(
    // `
    //   FOR p IN UNION_DISTINCT(
    //     FOR pr in Profile
    //     RETURN pr
    //     ,
    //     [ Document("${v2_org._id}") ]
    //   )
    //   RETURN p
    // `,
    `
    FOR pp IN UNION_DISTINCT(
      FOR p in Profile
        SORT RAND()
        FILTER p._published
        LIMIT 0, 15
      RETURN p
      ,
      FOR p in Profile
        SORT RAND()
        FILTER !p._published
        LIMIT 0, 5
      RETURN p
      ,
      [
        Document("Profile/vJpFfdtNbaNwPL51ipmSfbZmxyUMTf" /* martin@moodle.com[Profile] */),
        Document("Profile/TPsKc3VGFi05J486LbRkX9uHh9HxXc" /* liz@moodle.com[Profile] */),
        Document("Profile/V8haMOx8YYxMLnOYcWRdYpecvzFtWp" /* anna@moodle.com[Profile] */),
        Document("Profile/qFrZA4VJ8ba4uvkmEPxp8DpGeCofKS" /* alessandro@moodle.com[Profile] */),
        Document("Organization/wDsoiVDyDIIGrLTu3P26kc6QRg1PYG" /* moodlenet@moodle.com[Organization] */),
        Document("Profile/IOz4Q52ddl1JleKwHIrrhrLucz1A30" /* bru.mas@moodle.com[Profile] */),
        Document("Profile/Wn4IUjm2K2PFwoKFsC0xByxYlPcykg" /* ettorebevilacqua@gmail.com[Profile] */),
      ])
    return pp`,
    {},
    { count: true, batchSize: 1, ttl: 60 * 30 },
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
      const isOrg = isOrganization(v2_profile)
      shell.setNow(v2_profile._created)
      const createEmailUserResp = await createSimpleEmailUser({
        isAdmin: isOrg,
        displayName: v2_profile.name,
        email,
        hashedPassword: v2_user.password,
        publisher: v2_profile._published,
      })
      assert(createEmailUserResp.success)
      return createEmailUserResp
    })

    await initiateCallForProfileKey({
      _id: newProfile._id,
      async exec() {
        const isOrg = isOrganization(v2_profile)
        shell.setNow(v2_profile._edited)
        await editProfile(newProfile._key, {
          aboutMe: v2_profile.description,
          siteUrl: isOrg ? undefined : v2_profile.siteUrl,
          location: isOrg ? undefined : v2_profile.location,
          kudos: 1e6,
        })
        const avatarV2Field = isOrg ? v2_profile.smallLogo : v2_profile.avatar
        if (avatarV2Field?.ext === false) {
          await setProfileAvatar(
            {
              _key: newProfile._key,
              rpcFile: await getRpcFileByV2AssetLocation(
                avatarV2Field.location,
                `for profile avatar
          id v2:${v2_profile._id} v3:${newProfile._id}`,
              ),
            },
            { noResize: true },
          )
        }
        const imageV2Field = isOrg ? v2_profile.logo : v2_profile.image
        if (imageV2Field?.ext === false) {
          await setProfileBackgroundImage(
            {
              _key: newProfile._key,
              rpcFile: await getRpcFileByV2AssetLocation(
                imageV2Field.location,
                `for profile background image
          id v2:${v2_profile._id} v3:${newProfile._id}`,
              ),
            },
            { noResize: true },
          )
        }
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
function isOrganization(_: v2.Profile | v2.Organization): _ is v2.Organization {
  return _._id.startsWith('Organization')
}
