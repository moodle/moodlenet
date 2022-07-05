import {
  DataMessage,
  ExtDef,
  ExtName,
  ExtVersion,
  SubcriptionPaths,
  SubcriptionReq,
  SubcriptionVal,
  ValueData,
} from '@moodlenet/core'

export type PriMsgBaseUrl = `/_/_` //`^^

export type RawSubPriMsgSubUrl = `raw-sub` //`^^
export type RawSubPriMsgBaseUrl = `${PriMsgBaseUrl}/${RawSubPriMsgSubUrl}` //`^^

export type RawSubOpts<Def extends ExtDef, Path extends SubcriptionPaths<Def>> = {
  method: 'POST'
  path: `${RawSubPriMsgBaseUrl}/${ExtName<Def>}/${ExtVersion<Def>}/${Path}`
  req: SubcriptionReq<Def, Path>
  obsType: { msg: DataMessage<ValueData<SubcriptionVal<Def, Path>>> }
}
