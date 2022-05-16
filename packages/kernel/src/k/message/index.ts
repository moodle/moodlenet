import type { DataMessage, ExtDef, ExtId, MessagePush, Pointer, PortPathBinding, PortPaths } from '../../types'
import { isBWCSemanticallySamePointers } from '../pointer'

export function matchMessage<DestDef extends ExtDef>() {
  return <Path extends PortPaths<DestDef, PortPathBinding<DestDef, Path>>>(
    msg: MessagePush,
    matchPointer: Pointer<DestDef, Path>,
  ): msg is MessagePush<PortPathBinding<DestDef, Path>, ExtDef, DestDef, Path> => {
    return isBWCSemanticallySamePointers(msg.pointer, matchPointer)
  }
}

export function onMessage<DestDef extends ExtDef>(msg: MessagePush) {
  return <Path extends PortPaths<DestDef, PortPathBinding<DestDef, Path>>>(
    matchPointer: Pointer<DestDef, Path>,
    cb: (msg: MessagePush<PortPathBinding<DestDef, Path>, ExtDef, DestDef, Path>) => unknown,
  ) => {
    if (matchMessage<DestDef>()<Path>(msg, matchPointer)) {
      cb(msg)
    }
  }
}

export function manageMsg(msg: DataMessage<any>, extId: ExtId) {
  msg.managedBy = extId
  return msg
}
