import type {
  DataMessage,
  ExtDef,
  ExtName,
  ExtVersion,
  SubcriptionPaths,
  SubcriptionReq,
  SubcriptionVal,
  ValueData,
} from '@moodlenet/core'
import { MNPriHttpExt } from '.'

export type PriHttpSubUrlPrefix = `/_/${ExtName<MNPriHttpExt>}` // `^^
export type PriHttpSub<Def extends ExtDef, Path extends SubcriptionPaths<Def>> = {
  method: 'POST'
  path: `${PriHttpSubUrlPrefix}/${ExtName<Def>}/${ExtVersion<Def>}/${Path}`
  req: SubcriptionReq<Def, Path>
  obsType: { msg: DataMessage<ValueData<SubcriptionVal<Def, Path>>> }
}
