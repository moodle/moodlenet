import { Subscription } from 'rxjs'
import { ExtDef, MessagePush, Pointer, PortPathBinding, PortPaths, Shell } from '../../types'
import { manageMsg, onMessage } from '../message/index'

export function manageIn<Def extends ExtDef>(
  shell: Shell<Def>,
): <Path extends PortPaths<Def, PortPathBinding<Def, Path>>>(
  matchPointer: Pointer<Def, Path>,
  cb: (msg: MessagePush<PortPathBinding<Def, Path>, ExtDef, Def, Path>) => unknown,
) => Subscription {
  return (matchPointer, cb) =>
    shell.msg$.subscribe(msg =>
      onMessage<Def>(msg)(matchPointer, msg => {
        manageMsg(msg, shell.extId)
        return cb(msg as any)
      }),
    )
}
