import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import {
  createDir,
  deleteStaleTemp,
  deleteStorageFile,
  deleteTemp,
  get_temp_file_paths,
  getFsDirectories,
  use_temp_file,
  use_temp_file_as_web_image,
} from '@moodle/lib-storage-local-fs'
import { _void } from '@moodle/lib-types'
import { fileAssetMeta, domainFs } from '@moodle/module/storage'
import { useTempFileResult_to_adoptAssetResponse } from '@moodle/module/storage/lib'
import { readFile } from 'fs/promises'
import { StorageDefaultSecEnv } from './types'

export function get_storage_default_secondary_factory({ homeDir }: StorageDefaultSecEnv): secondaryProvider {
  return ctx => {
    const fsDirs = getFsDirectories({ domainName: ctx.domain, homeDir })

    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        write: {
          async useTempImageInProfile({ type: as, userProfileId, adoptAssetForm }) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const profileImagePath = domainFs.file.userProfile[userProfileId]!.profile[as]!()
            if (adoptAssetForm.type === 'none') {
              await deleteStorageFile({ path: profileImagePath, fsDirs })
              return { asset: adoptAssetForm, status: 'done' }
            }
            const {
              configs: { webImageResizes },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'storage' })
            const maxSizePixel = webImageResizes[as === 'avatar' ? 'medium' : 'large']
            return useTempFileResult_to_adoptAssetResponse(
              use_temp_file_as_web_image({
                fsDirs,
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
              use_temp_file({
                fsDirs,
                path: resourceDraftAssetPath,
                tempId: adoptAssetForm.tempId,
              }),
            )
          },
          async useTempImageInDraft({ draftId, adoptAssetForm, userProfileId, draftType }) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const draftImagePath = domainFs.file.userProfile[userProfileId]!.drafts[draftType][draftId]!.image!()
            if (adoptAssetForm.type === 'none') {
              await deleteStorageFile({ path: draftImagePath, fsDirs })
              return { asset: adoptAssetForm, status: 'done' }
            }
            const {
              configs: { webImageResizes },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'storage' })
            return useTempFileResult_to_adoptAssetResponse(
              use_temp_file_as_web_image({
                fsDirs,
                maxSizePixel: webImageResizes.large,
                path: draftImagePath,
                tempId: adoptAssetForm.tempId,
              }),
            )
          },
        },
      },
      storage: {
        sync: {
          async createUserProfile({ userProfileId }) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const userProfilePath = domainFs.dir.userProfile[userProfileId]!()
            return [await createDir({ dirPath: userProfilePath, fsDirs }), _void]
          },
        },
        query: {
          async tempMeta({ tempId }) {
            const { meta: temp_file_meta_path } = get_temp_file_paths({ tempId, fsDirs })

            const meta: fileAssetMeta = await readFile(temp_file_meta_path, 'utf8').then(JSON.parse).catch(null)

            if (!meta) {
              await deleteTemp({ tempId, fsDirs }).catch(() => null)
              return [false, { reason: 'notFound' }]
            }

            return [true, { meta }] //, temp_file_full_path, temp_file_name, temp_file_dir }
          },
        },
        write: {
          async deleteStaleTemp() {
            const deletedFiles = await deleteStaleTemp({ fsDirs })

            deletedFiles.forEach(result => {
              if (result.invalidUlid) {
                ctx.log('warn', ` deleted temp file [${result.deletedFile}] for invalid ulid`)
              }
            })
          },
        },
        // async useTempFile({ absolutePath, tempId }) {
        //   const { temp_file_meta_path } = get_temp_file_paths({ tempId })

        //   const meta: fileAssetMeta = await readFile(temp_file_meta_path, 'utf8')
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
