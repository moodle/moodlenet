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
//     tmpId,
//   }: {
//     tmpId: string
//   }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>> {
//     const { tmp_file_meta_path } = get_tmp_file_paths(tmpId)

//     const meta: blob_meta = await readFile(tmp_file_meta_path, 'utf8').then(JSON.parse).catch(null)

//     if (!meta) {
//       await deleteTemp({ tmpId }).catch(() => null)
//       return [false, { reason: 'notFound' }]
//     }

//     return [true, { meta }] //, tmp_file_full_path, tmp_file_name, tmp_file_dir }
//   }

//   async function mvTempFile({
//     tmpId,
//     destPath,
//   }: {
//     tmpId: string
//     destPath: path
//   }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>> {
//     const [found, found_tmp_meta] = await getTempFileMeta({ tmpId })

//     if (!found) {
//       return [false, { reason: 'notFound' }]
//     }

//     const fs_dest_path = path2fs(destPath)
//     await mkdir(fs_dest_path, { recursive: true })
//     const { tmp_file_path } = get_tmp_file_paths(tmpId)

//     await rename(tmp_file_path, fs_dest_path)
//     await deleteTemp({ tmpId })

//     return [true, { meta: found_tmp_meta.meta }]
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

//   function get_tmp_file_paths(tmpId: string) {
//     const tmp_file_dir_path = join(tempDir, tmpId)
//     const tmp_file_path = join(tmp_file_dir_path, 'tmp_file')
//     const tmp_file_meta_path = join(tmp_file_dir_path, 'meta.json')
//     return { tmp_file_dir_path, tmp_file_path, tmp_file_meta_path }
//   }

//   async function deleteTemp({ tmpId }: { tmpId: string }) {
//     const { tmp_file_dir_path } = get_tmp_file_paths(tmpId)
//     await rimraf(tmp_file_dir_path, { maxRetries: 2 }).catch(() => null)
//   }

//   function path2fs(path: path) {
//     const fs_path = [baseDir, ...path].join(sep)
//     return fs_path
//   }
// }
