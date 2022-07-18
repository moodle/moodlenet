import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { ConfigApiKey } from './types'; //emal, users
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
    create,
    save,
    getAll,
  }

  async function getAll(): Promise<ConfigApiKey> {
    const providers = await read()
    return providers
    //return providers.map((config: ConfigApiKey) => config)
  }

  function getNewConfig(newConfig: Omit<ConfigApiKey, 'id'>): ConfigApiKey {
    const id = Math.random().toString(36).substring(2)
    console.log('create ', newConfig)
    const config: ConfigApiKey = { ...newConfig, id }
    return config
  }


  async function create(newConfig: Omit<ConfigApiKey, 'id'>): Promise<ConfigApiKey> {
    const id = Math.random().toString(36).substring(2)
    const config: ConfigApiKey = { ...newConfig, id }
    await patchConfigs(config)
    return config
  }


  async function save(config: ConfigApiKey | Omit<ConfigApiKey, 'id'>) {
    const newConfig = 'id' in config ? config as ConfigApiKey: getNewConfig(config)
    //  newConfig
    console.log('create ', newConfig)
    // const config: ConfigApiKey = { ...newUser, id }
    await patchConfigs(newConfig)
    return newConfig
  }

  async function patchConfigs(patch: ConfigApiKey) {
    const currConfigs = await read()
    const patchedConfigs = { ...currConfigs, ...patch }
    await write(patchedConfigs)
    return patchedConfigs
  }


  async function read(): Promise<ConfigApiKey> {
    return JSON.parse(await readFile(file(), 'utf-8'))
  }

  async function write(configs: any) {
    await writeFile(file(), JSON.stringify(configs, null, 2))
  }

  function file() {
    return resolve(folder, 'configApiKey.json')
  }
}
