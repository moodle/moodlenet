import getStore from '@moodlenet/key-value-store/server'
import { shell } from '../shell.mjs'
export type KVSTypes = { dbVersion: number }

const currVersion = 0
export const kvStore = await getStore<KVSTypes>(shell)

const foundVersion = (await kvStore.get('dbVersion', '')).value ?? -1
if (foundVersion !== currVersion) {
  if (foundVersion > currVersion) {
    throw new Error(
      `found persistence version(${foundVersion}) higher than current (${currVersion}) !`,
    )
  }
  await import(`./v_${foundVersion}/init.mjs`)
  await kvStore.set('dbVersion', '', currVersion)
}
