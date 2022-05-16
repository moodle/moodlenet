import type { ExtDef, SubTopo } from '@moodlenet/kernel'

export type Session = { a: 1 }

export type MoodlenetIdentityManagerPorts = {
  ____: SubTopo<void, 0>
}

export type MoodlenetIdentityManagerExt = ExtDef<'moodlenet.identity-manager', '0.1.10', MoodlenetIdentityManagerPorts>

// declare module 'moodlenet.kernel' {
//   interface IMessage<
//     Data extends any = any,
//     Bound extends PortBinding = PortBinding,
//     SourceId extends ExtId = ExtId,
//     Point extends Pointer = Pointer,
//   > {
//     session: Session
//   }
// }
