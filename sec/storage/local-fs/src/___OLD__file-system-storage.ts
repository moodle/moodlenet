import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { deleteStaleTemp } from '@moodle/lib-domain-fs'
import {
  createStoredAssetTempFileSymlink,
  deleteStorageFile,
  localStorageFsDirectories,
  useTempFile,
  useTempFileAsWebImage,
} from '@moodle/lib-storage-local-fs'
import { domainFs } from '@moodle/module/storage'
import { useTempFileResult_to_adoptAssetResult } from '@moodle/module/storage/lib'
import { storageDefaultSecEnv } from './types'

export function get_storage_default_secondary_factory({ localFsStorageDirectory }: storageDefaultSecEnv): secondaryProvider {
  return ctx => {
    const { domainFsDirectories } = ctx
    const localStorageFsDirectories: localStorageFsDirectories = {
      ...domainFsDirectories,
      storageDir: localFsStorageDirectory,
    }

    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        write: {
          async useTempImageInProfile({ type: as, userProfileId, adoptAssetForm }) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const profileImagePath = domainFs.file.userProfile[userProfileId]!.profile[as]!()
            if (adoptAssetForm.type === 'none') {
              await deleteStorageFile({ path: profileImagePath, localStorageFsDirectories: localStorageFsDirectories })
              return { asset: adoptAssetForm, status: 'done' }
            }
            const {
              configs: { webImageResizes },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'storage' })
            const maxSizePixel = webImageResizes[as === 'avatar' ? 'medium' : 'large']
            return useTempFileResult_to_adoptAssetResult(
              useTempFileAsWebImage({
                localStorageFsDirectories,
                maxSizePixel,
                path: profileImagePath,
                tempId: adoptAssetForm.tempId,
              }),
            )
          },
          async useTempFileAsNewResourceDraftAsset({ adoptAssetForm, eduResourceDraftId: resourceDraftId, userProfileId }) {
            const resourceDraftAssetPath =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              domainFs.file.userProfile[userProfileId]!.drafts.eduResource[resourceDraftId]!.asset()
            return useTempFileResult_to_adoptAssetResult(
              useTempFile({
                localStorageFsDirectories,
                path: resourceDraftAssetPath,
                tempId: adoptAssetForm.tempId,
              }),
            )
          },
          async useTempImageInDraft({ draftId, adoptAssetForm, userProfileId, draftType }) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const draftImagePath = domainFs.file.userProfile[userProfileId]!.drafts[draftType][draftId]!.image!()
            if (adoptAssetForm.type === 'none') {
              await deleteStorageFile({ path: draftImagePath, localStorageFsDirectories: localStorageFsDirectories })
              return { asset: adoptAssetForm, status: 'done' }
            }
            const {
              configs: { webImageResizes },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'storage' })
            return useTempFileResult_to_adoptAssetResult(
              useTempFileAsWebImage({
                localStorageFsDirectories,
                maxSizePixel: webImageResizes.large,
                path: draftImagePath,
                tempId: adoptAssetForm.tempId,
              }),
            )
          },
        },
      },
      storage: {
        service: {
          async deleteStaleTemp() {
            const deletedFiles = await deleteStaleTemp({ domainFsDirectories })

            deletedFiles.forEach(result => {
              if (result.invalidUlid) {
                ctx.log.warn(` deleted temp file [${result.deletedFile}] for invalid ulid`)
              }
            })
          },
          async createStoredAssetTempFileReference({ storedAssetMeta, expiresSeconds }) {
            return createStoredAssetTempFileSymlink({
              expiresSeconds,
              localStorageFsDirectories,
              storedAssetMeta,
            })
          },
        },
      },
    }
    return secondaryAdapter
  }
}
