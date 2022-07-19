import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { PassportConfigs } from './types'; //emal, users

export type ConfigsStore = ReturnType<typeof configApiKeyStore>
export default function configApiKeyStore({ folder }: { folder: string }) {
  mkdirSync(folder, { recursive: true })

  if (!existsSync(file())) {
    write({})
  }

  return {
    read,
    patchConfigs,
    file,
    write,
  }

  async function patchConfigs(patch: PassportConfigs) {
    const currConfigs = await read()
    const patchedConfigs = { ...currConfigs, ...patch }
    await write(patchedConfigs)
    return patchedConfigs
  }

  async function read(): Promise<PassportConfigs> {
    return JSON.parse(await readFile(file(), 'utf-8'))
  }

  async function write(configs: any) {
      await writeFile(file(), JSON.stringify(configs, null, 2))
  }

  function file() {
    return resolve(folder, 'configApiKey.json')
  }
}
