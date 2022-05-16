import {
  EMPTY,
  filter,
  firstValueFrom,
  from,
  isObservable,
  map,
  materialize,
  merge,
  mergeMap,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
  takeWhile,
  tap,
  throwError,
} from 'rxjs'
import { isPromise } from 'util/types'
import type { DataMessage, ExtDef, ExtId, ExtTopo, Pointer, Port, PushOptions, Shell, TypeofPath } from '../../types'
import { manageMsg, matchMessage } from '../message'
import { isBWCSemanticallySamePointers, joinPointer, splitPointer } from '../pointer'
import {
  ProvidedValOf,
  SubcriptionPaths,
  SubcriptionReq,
  SubMsgObsOf,
  SubTopo,
  ValObsProviderOf,
  ValOf,
  ValPromiseOf,
  ValueData,
} from './types'
export * from './types'

function providedValToObsAndTeardown(providedValOf: ProvidedValOf<SubTopo<any, any>>) {
  const [valObs$_or_valPromise_orVal, tearDownLogic] = Array.isArray(providedValOf) ? providedValOf : [providedValOf]

  const valObs$ =
    isPromise(valObs$_or_valPromise_orVal) || isObservable(valObs$_or_valPromise_orVal)
      ? from(valObs$_or_valPromise_orVal)
      : of(valObs$_or_valPromise_orVal)

  return [valObs$, tearDownLogic] as const
}

const PUB_SYM = Symbol()
export function pub<Def extends ExtDef>(shell: Pick<Shell<Def>, 'emit' | 'msg$' | 'extId'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (valObsProvider: ValObsProviderOf<TypeofPath<ExtTopo<Def>, Path>>) => /* new Observable(subscriber =>  */ {
      const mainSub = new Subscription(killAllAndDelSUB)

      const SUBSCRIPTIONS: { [k in string]: () => void /* TeardownLogic | undefined  */ } = {}
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
          // tap(console.log),
          filter(msg => matchMessage<Def>()(msg, subP.subPointer as any)),
          mergeMap(subReqMsg => {
            manageMsg(subReqMsg, shell.extId)
            try {
              const [valObs$, tearDownLogic] = providedValToObsAndTeardown(
                valObsProvider({
                  msg: subReqMsg as any,
                }),
              )
              if (!subReqMsg.sub) {
                return EMPTY
              }
              const $UNSUB_THIS$ = new Subject()
              SUBSCRIPTIONS[subReqMsg.id] = () => {
                'function' === typeof tearDownLogic
                  ? tearDownLogic()
                  : tearDownLogic
                  ? tearDownLogic.unsubscribe()
                  : void 0

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
        // console.log({ teardownAndDelSUB: id, teardown, SUBSCRIPTIONS })
        delete SUBSCRIPTIONS[id]
        teardown?.()
      }
    } /* ) */
}

export function pubAll<Def extends ExtDef>(
  extId: ExtId<Def>,
  shell: Pick<Shell<Def>, 'emit' | 'msg$' | 'extId'>,
  handles: {
    [Path in SubcriptionPaths<Def>]: ValObsProviderOf<TypeofPath<ExtTopo<Def>, Path>>
  },
) {
  const allPubSubs = Object.entries(handles).map(([path, valObsProvider]) => {
    const pointer = joinPointer(extId, path)
    return pub(shell)(pointer as never)(valObsProvider as never)
  })
  const globalSub = new Subscription()
  allPubSubs.forEach(sub => globalSub.add(sub))
  return globalSub
}

export function subP<Def extends ExtDef>(shell: Pick<Shell, 'send' | 'msg$' | 'push'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (req: SubcriptionReq<Def, Path>) => {
      const valueData = firstValueFrom(sub<Def>(shell)<Path>(pointer)(req))
      return valueData as ValPromiseOf<TypeofPath<ExtTopo<Def>, Path>>
    }
}

export function subPVal<Def extends ExtDef>(shell: Pick<Shell, 'send' | 'msg$' | 'push'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    async (req: SubcriptionReq<Def, Path>) => {
      const valueData = await subP<Def>(shell)<Path>(pointer)(req)
      return valueData.msg.data as ValOf<TypeofPath<ExtTopo<Def>, Path>>
    }
}

export function subDemat<Def extends ExtDef>(shell: Pick<Shell, 'send' | 'msg$' | 'push'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (req: SubcriptionReq<Def, Path>, _opts?: Partial<PushOptions>) =>
      sub<Def>(shell)<Path>(pointer)(req, _opts).pipe(dematMessage())
}

export function dematMessage<T>() {
  return mergeMap<{ msg: DataMessage<ValueData<T>> }, { msg: DataMessage<T> }[]>(({ msg }) => {
    const notif = msg.data.value
    // console.log({ msg, notif, ________________________: '' })
    return typeof notif.kind !== 'string'
      ? (throwError(() => new TypeError('Invalid notification, missing "kind"')) as unknown as {
          msg: DataMessage<T>
        }[])
      : notif.kind === 'E'
      ? (throwError(() => new Error(notif.error)) as unknown as { msg: DataMessage<T> }[])
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

export function sub<Def extends ExtDef>(shell: Pick<Shell, 'send' | 'msg$' | 'push'>) {
  return <Path extends SubcriptionPaths<Def>>(pointer: Pointer<Def, Path>) =>
    (req: SubcriptionReq<Def, Path>, _opts?: Partial<PushOptions>) =>
      new Observable(subscriber => {
        console.log(`K sub`, pointer, req)
        const mainSub = new Subscription()
        try {
          const subP = sub_pointers<Def, Path>(pointer)
          const reqSplitP = splitPointer(subP.subPointer)
          const reqMsg = shell.send<Def>(reqSplitP.extId)(reqSplitP.path as never)({ req }, { ..._opts, sub: true })
          console.log(`K sub sent reqMsg `, String(reqMsg))
          const subscriberSub = shell.msg$
            .pipe(
              // tap(____ => console.log({ ____, reqMsg, valuePointer: subP.valuePointer })),
              filter(
                (msg): msg is DataMessage<ValueData<any>> =>
                  msg.parentMsgId === reqMsg.id && isBWCSemanticallySamePointers(subP.valuePointer, msg.pointer),
              ),
              takeWhile(msg => msg.data.value.kind !== 'C', true),
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

/*
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 ****************************  MAKING TESTS DOWN THERE  ***************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 **********************************************************************************************************
 */

type D = ExtDef<
  'xxxx',
  '1.4.3',
  {
    d: Port<'in', string>
    b: SubTopo<'req b', 'res b'>
    a: SubTopo<'req a', 'res a'>
    s: {
      g: Port<'in', 11>
      v: {
        l: Port<'out', string>
        a: SubTopo<'req s/v/a', 'res s/v/a'>
      }
      // a: FunTopo<C>
    }
  }
>
declare const shell: Shell<D>
;async () => {
  const g = sub<D>(shell)('xxxx@1.4.3::s/v/a')('req s/v/a').subscribe(_ => {})
  const h = sub<D>(shell)('xxxx@1.4.3::a')('req a').subscribe(_ => {
    _.msg.data.value.kind === 'N' && _.msg.data.value.value
  })
  const w = subDemat<D>(shell)('xxxx@1.4.3::a')('req a').subscribe(_ => {
    _.msg.data
  })
  w
  // sub<D>(shell)('xxxx@1.4.3::alpha/beta/gamma')(4).subscribe(_ => {})
  // sub<D>(shell)('xxxx@1.4.3::/alpha/beta/gamma')(4).subscribe(_ => {})
  // sub<D>(shell)('xxxx@1.4.3:/alpha/beta/gamma')(4).subscribe(_ => {})
  // sub<D>(shell)('xxxx@1.4.3/alpha/beta/gamma')(4).subscribe(_ => {})
  // sub<D>(shell)('/xxxx@1.4.3/alpha/beta/gamma')(4).subscribe(_ => {})
  // sub<D>(shell)('/xxxx/1.4.3/alpha/beta/gamma')(4).subscribe(_ => {})

  g
  h
  pub<D>(shell)('xxxx@1.4.3::a')(async _ => {
    const o = await subPVal<D>(shell)('xxxx@1.4.3::a')('req a')
    subDemat<D>(shell)('xxxx@1.4.3::a')('req a')
      .pipe()
      .subscribe(_ => {
        _.msg.data
      })

    return o //[o, () => {}]
    /*
  return [firstValueFrom(o), () => {}]
  return 8
  return o
  return [o]
  return lastValueFrom( o)
  return [6,8]
  return [Promise.resolve(8)]
 */
  })
  pubAll<D>('xxxx@1.4.3', shell, {
    's/v/a': _a =>
      sub<D>(shell)('xxxx@1.4.3::s/v/a')('req s/v/a').pipe(
        dematMessage(),
        map(_ => _.msg.data),
      ),
    'a': _a => {
      _a.msg.data.req === 'req a'
      // @ts-expect-error
      _a.msg.data.req === 'req aa'
      return sub<D>(shell)('xxxx@1.4.3::a')('req a').pipe(
        dematMessage(),
        map(_ => _.msg.data),
      )
    },
    'b': _a =>
      sub<D>(shell)('xxxx@1.4.3::b')(_a.msg.data.req).pipe(
        dematMessage(),
        map(_ => _.msg.data),
      ),
  })
  // // const j: ExtsubTopoPaths<D> = 'a'
  // // listen.port<D>(s)('xxxx@1.4.3::s.v.l', ({ message: { payload } }) => {})
  // // listen.ext<D>(s, 'xxxx@1.4.3')('s.g', ({ message: { payload } }) => {})
}
