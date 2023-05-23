import { kvStore } from './kvStore.mjs'

const PERSISTENCE_VERSION = -98
let currentPersistentVersion = (await kvStore.get('persistence-version', '')).value?.v ?? NaN
if (currentPersistentVersion > PERSISTENCE_VERSION) {
  throw new Error(
    `CRITICAL : found persistence at version ${currentPersistentVersion}, higher than current (${PERSISTENCE_VERSION})`,
  )
}

while (currentPersistentVersion !== PERSISTENCE_VERSION) {
  currentPersistentVersion = (
    await import(`./persistence-upgrades/@${currentPersistentVersion}/up.mjs`)
  ).default
  await kvStore.set('persistence-version', '', { v: currentPersistentVersion })
}
