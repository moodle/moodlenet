import { Ext, ExtId, ExtName, Version } from '.'

export type DepGraphData = { version: Version; ext: Ext }
export type CheckDepGraphRes =
  | {
      type: 'cyclic'
      cycle: ExtName[]
    }
  | {
      type: 'unknown-error'
      message: string
    }
  | {
      type: 'unmatched-dep-version'
      unmatches: {
        ext: Ext
        unmatchedDeps: ExtId[]
      }[]
    }
  | {
      type: 'pass'
      overallOrder: Ext[]
    }
export type CheckCycleRes =
  | { type: 'acyclic'; overallOrder: string[] }
  | { type: 'cyclic'; cycle: string[]; message: string }
  | { type: 'unknown-error'; message: string }
