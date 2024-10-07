'use server'

import { getProfileInfoPrimarySchemas } from 'domain/src/user-hone'
import { createWriteStream } from 'fs'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { Readable } from 'stream'
import { inspect } from 'util'
import { zfd } from 'zod-form-data'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import { priAccess } from '../../../../../lib/server/session-access'

export async function getProfileInfoSchema() {
  const { configs } = await priAccess().userHome.read.configs()
  return getProfileInfoPrimarySchemas(configs.profileInfoPrimaryMsgSchemaConfigs)
    .updateProfileInfoSchema
}

export const updateProfileInfo = defaultSafeActionClient
  .schema(getProfileInfoSchema)
  .action(async ({ parsedInput: profileInfo }) => {
    const [readUserHomeDone, userHomeRes] = await priAccess().userHome.read.userHome({
      by: { idOf: 'user_home', user_home_id: profileInfo.user_home_id },
    })
    if (!readUserHomeDone || !userHomeRes.accessObject.permissions.editProfile) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`cannot edit this profile info`)],
      })
    }
    const [editDone, editResult] = await priAccess().userHome.write.editProfileInfo({
      user_home_id: profileInfo.user_home_id,
      profileInfo: profileInfo,
    })
    if (editDone) {
      revalidatePath(sitepaths.profile[profileInfo.user_home_id]![profileInfo.displayName]!())
      return
    }
    returnValidationErrors(getProfileInfoSchema, {
      _errors: [t(`something went wrong while saving profile info`) + ` : ${editResult.reason}`],
    })
  })

export async function uploadAvatarAction(form: FormData) {
  const { file: avatar } = zfd
    .formData({
      file: zfd.file(),
    })
    .parse(form)

  console.log(
    '->',
    inspect(
      { avatar },
      {
        colors: true,
        depth: 10,
        showHidden: true,
        sorted: true,
        getters: true,
      },
    ),
  )
  if (typeof avatar !== 'string') {
    const writeStream = createWriteStream(`/home/alec/____uploaded___${avatar.name}`, {
      flags: 'w',
    })
    Readable.from(avatar.stream() as any).pipe(writeStream)
  }
  return {
    fileUrl: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  }
}

