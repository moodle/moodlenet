import { Database } from 'arangojs'
import { valid } from 'semver'
export type Version = string & { readonly _: unique symbol }
export type MigrationRecord = {
  version: Version
  date: Date
}
export const getVersion = (_: string): null | Version => valid(_, {}) as null | Version

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
