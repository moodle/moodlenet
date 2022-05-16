import { ExtDef, ExtId } from './ext'
import type { Pointer, PortBinding, PortPathData, PortPaths } from './topo'

export type MsgID = string
export type MessagePush<
  Bound extends PortBinding = PortBinding,
  SourceDef extends ExtDef = ExtDef,
  DestDef extends ExtDef = ExtDef,
  Path extends PortPaths<DestDef, Bound> = PortPaths<DestDef, Bound>,
> = IMessage<PortPathData<DestDef, Path, Bound>, Bound, ExtId<SourceDef>, Pointer<DestDef, Path>>

export type DataMessage<
  Data,
  Bound extends PortBinding = PortBinding,
  SourceId extends ExtId = ExtId,
  Point extends Pointer = Pointer,
>= IMessage<Data,Bound,SourceId,Point>

export interface IMessage<
  Data extends any=any,
  Bound extends PortBinding =PortBinding ,
  SourceId extends ExtId =ExtId ,
  Point extends Pointer =Pointer ,
> {
  id: MsgID
  bound: Bound
  source: SourceId
  pointer: Point
  data: Data
  parentMsgId?: MsgID
  sub: boolean
  managedBy?: ExtId
  activeDest: ExtId
}
