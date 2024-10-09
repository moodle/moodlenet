// import { _void, blob_meta, ok_ko, path } from '@moodle/lib-types'
// import { mkdir, readdir, readFile, rename, stat } from 'fs/promises'
// import { dirname, join, normalize, sep } from 'path'
// import { rimraf } from 'rimraf'

// export function localFsStorage({ baseDir, tempDir }: { baseDir: string; tempDir: string }) {
//   return {
//     getTempFileMeta,
//     deletePath,
//     mvTempFile,
//   }

//   async function getTempFileMeta({
//     tempId,
//   }: {
//     tempId: string
//   }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>> {
//     const { temp_file_meta_path } = get_temp_file_paths(tempId)

//     const meta: blob_meta = await readFile(temp_file_meta_path, 'utf8').then(JSON.parse).catch(null)

//     if (!meta) {
//       await deleteTemp({ tempId }).catch(() => null)
//       return [false, { reason: 'notFound' }]
//     }

//     return [true, { meta }] //, temp_file_full_path, temp_file_name, temp_file_dir }
//   }

//   async function mvTempFile({
//     tempId,
//     destPath,
//   }: {
//     tempId: string
//     destPath: path
//   }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>> {
//     const [found, found_temp_meta] = await getTempFileMeta({ tempId })

//     if (!found) {
//       return [false, { reason: 'notFound' }]
//     }

//     const fs_dest_path = path2fs(destPath)
//     await mkdir(fs_dest_path, { recursive: true })
//     const { temp_file_path } = get_temp_file_paths(tempId)

//     await rename(temp_file_path, fs_dest_path)
//     await deleteTemp({ tempId })

//     return [true, { meta: found_temp_meta.meta }]
//   }

//   async function deletePath({
//     path,
//     type,
//   }: {
//     path: path
//     type: 'file' | 'dir'
//   }): Promise<ok_ko<void, { notFound: unknown; unexpectedType: unknown }>> {
//     const fs_path = path2fs(path)
//     const file_stats = await stat(fs_path).catch(() => null)
//     if (!file_stats) {
//       return [false, { reason: 'notFound' }]
//     }
//     if (type === 'dir' && !file_stats.isDirectory()) {
//       return [false, { reason: 'unexpectedType' }]
//     }
//     if (type === 'file' && !file_stats.isFile()) {
//       return [false, { reason: 'unexpectedType' }]
//     }
//     await _delete_and_clean_upper_empty_dirs({ fs_path })
//     return [true, _void]
//   }
//   async function _delete_and_clean_upper_empty_dirs({ fs_path }: { fs_path: string }) {
//     //TODO: ensure this check is enough to avoid climbing up too much !
//     if (normalize(baseDir).startsWith(normalize(fs_path))) {
//       return
//     }
//     await rimraf(fs_path, { maxRetries: 2 }).catch(() => null)
//     const parent_dir = dirname(fs_path)
//     const parent_dir_files = await readdir(parent_dir).catch(() => [
//       `placeholder in case of (unlikely) readdir error
//         to prevent deleting this dir, as it's not ensured to be empy`,
//     ])
//     if (parent_dir_files.length > 0) {
//       return
//     }
//     return _delete_and_clean_upper_empty_dirs({ fs_path: parent_dir })
//   }

//   function get_temp_file_paths(tempId: string) {
//     const temp_file_dir_path = join(tempDir, tempId)
//     const temp_file_path = join(temp_file_dir_path, 'temp_file')
//     const temp_file_meta_path = join(temp_file_dir_path, 'meta.json')
//     return { temp_file_dir_path, temp_file_path, temp_file_meta_path }
//   }

//   async function deleteTemp({ tempId }: { tempId: string }) {
//     const { temp_file_dir_path } = get_temp_file_paths(tempId)
//     await rimraf(temp_file_dir_path, { maxRetries: 2 }).catch(() => null)
//   }

//   function path2fs(path: path) {
//     const fs_path = [baseDir, ...path].join(sep)
//     return fs_path
//   }
// }
