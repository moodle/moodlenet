import {
  EMPTY,
  filter,
  firstValueFrom,
  from,
  map,
  materialize,
  merge,
  mergeMap,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  takeWhile,
  tap,
  throwError,
} from 'rxjs'
// import type { DataMessage, ExtDef, ExtId, ExtTopo, Pointer, Port, PushOptions, RawShell, TypeofPath } from '../../types'
import type { DataMessage, ExtDef, ExtId, ExtTopo, Pointer, PushOptions, RawShell, TypeofPath } from '../../types'
import { manageMsg, matchMessage } from '../message'
import { isBWCSemanticallySamePointers, joinPointer, splitPointer } from '../pointer'
import { SubcriptionPaths, SubcriptionReq, SubMsgObsOf, ValObsProviderOf, ValueData } from './types'
export * from './types'

const PUB_SYM = Symbol()
export function pub<Def extends ExtDef>(shell: Pick<RawShell<Def>, 'emit' | 'msg$' | 'extId'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (valObsProvider: ValObsProviderOf<TypeofPath<ExtTopo<Def>, Path>>) => /* new Observable(subscriber =>  */ {
      const mainSub = new Subscription(killAllAndDelSUB)

      const SUBSCRIPTIONS: { [core in string]: () => void /* TeardownLogic | undefined  */ } = {}
      const $ALL_SUBSCRIPTIONS_KILLER$ = new Subject<never>()
      const subP = sub_pointers<Def, Path>(pointer)
      const unsubsSub = shell.msg$
        .pipe(
          filter(mUnsubMsg => matchMessage<Def>()(mUnsubMsg, subP.unsubPointer as any)),
          map(msg => msg.parentMsgId),
          filter((id): id is string => !!id),
        )
        .subscribe(teardownAndDelSUB)
      const manageMsgsSub = shell.msg$
        .pipe(
          // tap(),
          filter(msg => matchMessage<Def>()(msg, subP.subPointer as any)),
          mergeMap(subReqMsg => {
            manageMsg(subReqMsg, shell.extId)
            try {
              const valObs$ = from(valObsProvider(subReqMsg.data.req, subReqMsg))
              if (!subReqMsg.sub) {
                return EMPTY
              }
              const $UNSUB_THIS$ = new Subject()
              SUBSCRIPTIONS[subReqMsg.id] = () => {
                $UNSUB_THIS$.next(0)
                $UNSUB_THIS$.complete()
              }
              return merge(
                $ALL_SUBSCRIPTIONS_KILLER$,
                valObs$.pipe(
                  takeUntil($UNSUB_THIS$),
                  materialize(),
                  tap(notif => ((notif as any)[PUB_SYM] = subReqMsg)),
                ),
              )
            } catch (err: any) {
              return throwError(() => err).pipe(
                materialize(),
                tap(notif => ((notif as any)[PUB_SYM] = subReqMsg)),
              )
            }
          }),
        )
        .subscribe(pubNotifValue => {
          const parentMsg: DataMessage<any> = (pubNotifValue as any)[PUB_SYM]
          delete (pubNotifValue as any)[PUB_SYM]
          const valueSpl = splitPointer(subP.valuePointer)
          shell.emit(valueSpl.path as never)({ value: pubNotifValue }, { parent: parentMsg })
        })

      manageMsgsSub.add(mainSub)
      mainSub.add(manageMsgsSub)
      mainSub.add(unsubsSub)

      return mainSub

      function killAllAndDelSUB() {
        $ALL_SUBSCRIPTIONS_KILLER$.error(`${pointer} publisher ended`)
        // brutally kills pending subscriptions when unsubscribing..
        // TODO: define and implement policies, gentle unsubs ..
        Object.keys(SUBSCRIPTIONS).forEach(teardownAndDelSUB)
      }

      function teardownAndDelSUB(id: string) {
        const teardown = SUBSCRIPTIONS[id]
        delete SUBSCRIPTIONS[id]
        teardown?.()
      }
    } /* ) */
}

export function pubAll<Def extends ExtDef>(extId: ExtId<Def>, shell: Pick<RawShell<any>, 'emit' | 'msg$' | 'extId'>) {
  return (handles: {
    [Path in SubcriptionPaths<Def>]: ValObsProviderOf<TypeofPath<ExtTopo<Def>, Path>>
  }) => {
    const allPubSubs = Object.entries(handles).map(([path, valObsProvider]) => {
      const pointer = joinPointer(extId, path)
      return pub(shell)(pointer as never)(valObsProvider as never)
    })
    const globalSub = new Subscription()
    allPubSubs.forEach(sub => globalSub.add(sub))
    return globalSub
  }
}

// export function subP<Def extends ExtDef>(shell: Pick<Shell, 'send' | 'msg$' | 'push'>) {
//   return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
//     (req: SubcriptionReq<Def, Path>) => {
//       const valueData = firstValueFrom(sub<Def>(shell)<Path>(pointer)(req))
//       return valueData as ValPromiseOf<TypeofPath<ExtTopo<Def>, Path>>
//     }
// }

// export function subPVal<Def extends ExtDef>(shell: Pick<Shell, 'send' | 'msg$' | 'push'>) {
//   return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
//     async (req: SubcriptionReq<Def, Path>) => {
//       const valueData = await subP<Def>(shell)<Path>(pointer)(req)
//       return valueData.msg.data as ValOf<TypeofPath<ExtTopo<Def>, Path>>
//     }
// }

export function subDemat<Def extends ExtDef>(shell: Pick<RawShell, 'send' | 'msg$' | 'push'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (req: SubcriptionReq<Def, Path>, _opts?: Partial<PushOptions>) =>
      sub<Def>(shell)<Path>(pointer)(req, _opts).pipe(dematMessage())
}

export function dematMessage<T>() {
  return mergeMap<{ msg: DataMessage<ValueData<T>> }, { msg: DataMessage<T> }[]>(({ msg }) => {
    const notif = msg.data.value
    return typeof notif.kind !== 'string'
      ? (throwError(() => new TypeError('Invalid notification, missing "kind"')) as unknown as {
          msg: DataMessage<T>
        }[])
      : notif.kind === 'E'
      ? (throwError(() => new Error(notif.error, { cause: notif.error })) as unknown as { msg: DataMessage<T> }[])
      : notif.kind === 'N'
      ? [{ msg: { ...msg, data: notif.value } }]
      : notif.kind === 'C'
      ? []
      : (throwError(
          () =>
            new TypeError(
              `Invalid notification, unknown "kind" ` +
                // @ts-expect-error
                notif.kind,
            ),
        ) as unknown as { msg: DataMessage<T> }[])
  })
}

export function fetch<Def extends ExtDef>(shell: Pick<RawShell<any>, 'send' | 'msg$' | 'push'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (req: SubcriptionReq<Def, Path>, _opts?: Partial<PushOptions>) =>
      firstValueFrom(subDemat<Def>(shell)<Path>(pointer)(req, _opts))
}

export function sub<Def extends ExtDef>(shell: Pick<RawShell, 'send' | 'msg$' | 'push'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (req: SubcriptionReq<Def, Path>, _opts?: Partial<PushOptions>) =>
      new Observable(subscriber => {
        const mainSub = new Subscription()
        try {
          const subP = sub_pointers<Def, Path>(pointer)
          const reqSplitP = splitPointer(subP.subPointer)
          const reqMsg = shell.send<Def>(reqSplitP.extId)(reqSplitP.path as never)({ req }, { ..._opts, sub: true })
          const subscriberSub = shell.msg$
            .pipe(
              filter(
                (msg): msg is DataMessage<ValueData<any>> =>
                  msg.parentMsgId === reqMsg.id && isBWCSemanticallySamePointers(subP.valuePointer, msg.pointer),
              ),
              takeWhile(msg => msg.data.value.kind === 'N', true),
              map(msg => ({ msg })),
            )
            .subscribe(subscriber)
          mainSub.add(subscriberSub)
          return () => {
            const unsubSplitP = splitPointer(subP.unsubPointer)
            shell.send<Def>(unsubSplitP.extId)(unsubSplitP.path as never)(void 0, { parent: reqMsg })
            subscriberSub.unsubscribe() // maybe useless .. but not harmful
          }
        } catch (err) {
          subscriber.error(err)
          return () => mainSub.unsubscribe()
        }
      }) as SubMsgObsOf<TypeofPath<ExtTopo<Def>, Path>>
}

function sub_pointers<Def extends ExtDef, Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) {
  return {
    subPointer: `${pointer}/sub` as `${Pointer<Def, Path>}/sub`,
    valuePointer: `${pointer}/value` as `${Pointer<Def, Path>}/value`,
    unsubPointer: `${pointer}/unsub` as `${Pointer<Def, Path>}/unsub`,
    // unsubOut: `${pointer}/unsubOut` as `${Pointer<Def, Path>}/unsubOut`,
  }
}
