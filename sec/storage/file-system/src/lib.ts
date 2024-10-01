import { blob_meta } from '@moodle/lib-types'
import { mkdir, readdir, readFile, rename, stat } from 'fs/promises'
import { join } from 'path'
import { rimraf } from 'rimraf'

export async function getTempFileInfo({ tmpId, tempDir }: { tmpId: string; tempDir: string }) {
  const tmp_file_dir = join(tempDir, tmpId)
  const files = await readdir(tmp_file_dir).catch(() => [])
  const tmp_meta_filename = files.find(filename => filename.endsWith(meta_suffix))
  if (!tmp_meta_filename) {
    return null
  }
  const tmp_file_name = tmp_meta_filename.slice(0, -meta_suffix.length)
  const tmp_file_full_path = join(tmp_file_dir, tmp_file_name)
  const tmp_file_stats = await stat(tmp_file_full_path).catch(() => null)
  if (!tmp_file_stats?.isFile()) {
    return removeTmpFileDir()
  }

  const blob_meta: blob_meta = await readFile(join(tmp_file_dir, tmp_meta_filename), 'utf8')
    .then(JSON.parse)
    .catch(null)

  if (!blob_meta) {
    return removeTmpFileDir()
  }

  return { blob_meta, tmp_file_full_path, tmp_file_name, tmp_file_dir }

  function removeTmpFileDir() {
    deletePath({ full_path_name: tmp_file_dir, type: 'dir' })
    return null
  }
}
export async function mvTempFile({
  tmpId,
  tempDir,
  full_path_name,
}: {
  tmpId: string
  full_path_name: string
  tempDir: string
}) {
  const tmp_meta = await getTempFileInfo({ tmpId, tempDir })
  if (!tmp_meta) {
    return null
  }
  await mkdir(full_path_name, { recursive: true })

  await rename(tmp_meta.tmp_file_full_path, full_path_name)
  deletePath({ full_path_name: tmp_meta.tmp_file_dir, type: 'dir' })

  return { tmp_meta }
}

export async function deletePath({
  full_path_name,
  type,
}: {
  full_path_name: string
  type: 'file' | 'dir'
}) {
  const file_stats = await stat(full_path_name).catch(() => null)
  if (!file_stats) {
    return null
  }
  if (type === 'dir' && !file_stats.isDirectory()) {
    throw new Error('Not a directory')
  }
  if (type === 'file' && !file_stats.isFile()) {
    throw new Error('Not a file')
  }
  await rimraf(full_path_name, { maxRetries: 2 }).catch(() => null)
  return null
}
export const meta_suffix = '.meta.json'
