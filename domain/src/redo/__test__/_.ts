/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import * as m from '../moodle-domain'
declare module '../moodle-domain' {
  interface Modules {
    ciccio: CiccioModule
  }
}

export type CiccioModule = m.Module<{
  useCases: {
    some: {
      epx: [void, { x: string }]
      ep1: [{ a: number }, { x: string }]
      ep2: [{ b: number }, { c: boolean }]
    }
  }
  model: {
    stEp: m.Endpoint<[{ aNumber: number }, { res: string }, 'query']>
    stCosa: m.StaticData<{ statica: string }>
    b: {
      c: {
        buEp: m.Endpoint<[{ aNumber: number }, { res: string }, 'async']>
      }
      basEp: m.Endpoint<[{ aNumber: number }, { res: string }, 'query']>
      bsEp: m.Endpoint<[{ aNumber: number }, { res: string }, 'sync']>
    }
    aIdsm: m.IdSpaceMap<{
      shape: {
        // asset: Asset<{ removable: true }>
        // a_bFile: FsFile
        a_ep: m.Endpoint<[{ aNumber: number }, { res: string }, 'async']>
        // a_info: DataEntity<{ name: string }, { conditions: { isAdmin: boolean } }>
        a_sub: m.IdSpaceMap<{
          shape: {
            a_subCosa: m.EntityData<{ lolo: string }, { conditions: { x: number } }>
          }
        }>
      }
    }>
  }
}>
