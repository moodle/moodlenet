import type {
  DataMessage,
  ExtDef,
  ExtName,
  ExtVersion,
  SubcriptionPaths,
  SubcriptionReq,
  SubcriptionVal,
} from '@moodlenet/core'

export type PriHttpSub<Def extends ExtDef, Path extends SubcriptionPaths<Def>> = {
  method: 'POST'
  path: `_/${ExtName<Def>}/${ExtVersion<Def>}/${Path}`
  req: SubcriptionReq<Def, Path>
  obsType: { msg: DataMessage<SubcriptionVal<Def, Path>> }
}
