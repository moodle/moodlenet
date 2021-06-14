import { Database } from 'arangojs'
import { valid } from 'semver'
export type Version<V extends string = string> = V //string  & { readonly _: unique symbol }
export type MigrationRecord<V extends string> = {
  version: Version<V>
  date: Date
}

export const isVersion = <V extends string>(_: V): _ is Version<V> => !!valid(_, {})
export const getVersion = <V extends string>(_: V) => (isVersion(_) ? (_ as Version<V>) : null)
export const versionOrThrow = <V extends string>(_: V) => {
  const v = getVersion(_)
  if (!v) {
    throw new Error(`[${_}] not a valid version`)
  }
  return v
}

export type DBWorker = (_: { db: Database }) => Promise<unknown>
export type VersionUpdater =
  | {
      pullUp: DBWorker
      pushDown: DBWorker
    }
  | {
      initialSetUp: DBWorker
    }
export type VersionLadder = Record<string, VersionUpdater>

export type VersionedDB<V extends string> = Database & { readonly __v__: Version<V> }
