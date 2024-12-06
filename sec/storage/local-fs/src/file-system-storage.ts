import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { createTempFile, deleteStaleTemp } from '@moodle/lib-domain-fs'
import {
  deleteStorageFile,
  localStorageFsDirectories,
  useTempFile,
  useTempFileAsWebImage,
} from '@moodle/lib-storage-local-fs'
import { domainFs } from '@moodle/module/storage'
import { useTempFileResult_to_adoptAssetResponse } from '@moodle/module/storage/lib'
import { StorageDefaultSecEnv } from './types'

export function get_storage_default_secondary_factory({ localFsStorageDirectory }: StorageDefaultSecEnv): secondaryProvider {
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
            return useTempFileResult_to_adoptAssetResponse(
              useTempFileAsWebImage({
                localStorageFsDirectories,
                maxSizePixel,
                path: profileImagePath,
                tempId: adoptAssetForm.tempId,
              }),
            )
          },
          async useTempFileAsResourceDraftAsset({ adoptAssetForm, resourceDraftId, userProfileId }) {
            const resourceDraftAssetPath =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              domainFs.file.userProfile[userProfileId]!.drafts.eduResource[resourceDraftId]!.asset()
            return useTempFileResult_to_adoptAssetResponse(
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
            return useTempFileResult_to_adoptAssetResponse(
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
          async createStoredAssetTempFileReference({ storedAssetMeta, expiresSeconds }) {
            const { tempId } = await createTempFile({
              expiresSeconds,
              fileName: storedAssetMeta.name,
              domainFsDirectories,
              readable,
            })
            return { tempId }
          },
        },
        query: {},
        write: {
          async deleteStaleTemp() {
            const deletedFiles = await deleteStaleTemp({ domainFsDirectories })

            deletedFiles.forEach(result => {
              if (result.invalidUlid) {
                ctx.log('warn', ` deleted temp file [${result.deletedFile}] for invalid ulid`)
              }
            })
          },
        },
        // async useTempFile({ absolutePath, tempId }) {
        //   const { temp_file_meta_path } = get_temp_file_paths({ tempId })

        //   const meta: fileMeta = await readFile(temp_file_meta_path, 'utf8')
        //     .then(JSON.parse)
        //     .catch(null)
        //   if (!meta) {
        //     await deleteTemp({ tempId }).catch(() => null)
        //     return [false, { reason: 'notFound' }]
        //   }

        //   const fs_dest_path = path2modFsPath({ path: absolutePath })
        //   await mkdir(fs_dest_path, { recursive: true })
        //   const { temp_file_path } = get_temp_file_paths({ tempId })

        //   await rename(temp_file_path, fs_dest_path)
        //   await deleteTemp({ tempId })

        //   return [true, { meta }]
        // },
      },
    }
    return secondaryAdapter
  }
}
