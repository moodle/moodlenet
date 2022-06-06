import { DepGraph } from 'dependency-graph'
import { mergeMap, of, share, Subject } from 'rxjs'
import { depGraphAddNodes } from './dep-graph'
import * as KLib from './k-lib'
import { matchMessage } from './k-lib/message'
import { isExtIdBWC, joinPointer, splitExtId, splitPointer } from './k-lib/pointer'
import { makePkgMng, pkgDiskInfoOf } from './npm-pkg'
import { createLocalDeploymentRegistry } from './registry/node'
import type {
  DataMessage,
  DepGraphData,
  DeployableBag,
  DeploymentBag,
  DeploymentShell,
  ExposedPointerMap,
  ExposePointers,
  Ext,
  ExtBag,
  ExtDef,
  ExtId,
  ExtName,
  ExtPackage,
  ExtPkgInfo,
  KernelExt,
  MessagePush,
  MWFn,
  PkgRegistry,
  PushMessage,
  PushOptions,
  RawExtEnv,
  RegDeployment,
  Shell,
} from './types'

export type K = Awaited<ReturnType<typeof create>>
export type CreateCfg = {
  getPkgReg(): Promise<PkgRegistry>
  extEnvVars: Record<ExtName, RawExtEnv>
  wd: string
}

// export const kernelPkgInfo: PkgInfo = { name: 'moodlenet.kernel', version: '0.1.10' }
export const kernelExtId: ExtId<KernelExt> = 'moodlenet.kernel@0.1.10'

// type Env = {
// }
// function getEnv(rawExtEnv: RawExtEnv): Env {
//   return rawExtEnv as any //implement checks
// }

export const create = async ({ extEnvVars, wd, getPkgReg }: CreateCfg) => {
  const pkgMng = makePkgMng({ wd })
  const EXPOSED_POINTERS_REG: Record<ExtName, ExposedPointerMap> = {}
  // const _env = getEnv(global_env['moodlenet.kernel'])

  const deplReg = createLocalDeploymentRegistry()
  const depGraph = new DepGraph<DepGraphData>()
  const $MAIN_MSGS$ = new Subject<DataMessage<any>>()
  const pipedMessages$ = $MAIN_MSGS$.pipe(
    // tap(msg => console.log('++++++msg', msg)),
    mergeMap(msg => {
      const orderDepl = depOrderDeployments()
      // console.log({ orderDepl })
      if (msg.bound === 'in') {
        const { extName: msgExtName } = splitExtId(splitPointer(msg.pointer).extId)
        const destDeplIndex = orderDepl.findIndex(({ extId }) => {
          const { extName: thisExtName } = splitExtId(extId)
          return thisExtName === msgExtName
        })
        if (destDeplIndex < 0) {
          console.error({ msg, destDeplIndex })
          throw new Error(`message pipe: can't find deployment for ext: ${msgExtName}`)
        }
        const destDepl = orderDepl.splice(destDeplIndex, 1)
        orderDepl.push(...destDepl)
      }
      // console.log({ orderDepl: orderDepl.map(_ => _.ext.id), msg })
      return orderDepl
        .map(({ mw }) => mw)
        .filter((mw): mw is MWFn => !!mw)
        .reduce(($, mwFn) => $.pipe(mergeMap(mwFn)), of(msg))
    }),
    // tap(msg => setImmediate(() => console.log('*******msg', msg))),
    share(),
  )

  const kernelExt: Ext<KernelExt> = {
    id: kernelExtId,
    displayName: 'K',
    description: 'K',
    requires: [],
    enable: shell => {
      return {
        deploy(
          {
            /* , tearDown  */
          },
        ) {
          shell.expose({
            'pkgs/all/sub': {
              validate() {
                return { valid: true }
              },
            },
          })
          shell.lib.pubAll<KernelExt>('moodlenet.kernel@0.1.10', shell, {
            async 'pkgs/all'() {
              const reg = await getPkgReg()
              console.log(reg.map(_ => ({ exts: _.exts, __: _.pkgDiskInfo.name })))
              const allInfo = reg.map<ExtPkgInfo>(_ => ({
                pkgInfo: {
                  name: _.pkgDiskInfo.name,
                  version: _.pkgDiskInfo.version,
                },
                exts: _.exts.map(_ => ({
                  id: _.id,
                  displayName: _.displayName,
                  description: _.description,
                  requires: _.requires,
                })),
              }))
              return allInfo
            },
          })
          return {}
        },
      }
    },
  }
  // depGraphAddNodes(depGraph, [kernelExt])
  const pkgDiskInfo = pkgDiskInfoOf(__filename)
  const KDeployment = (await enableAndDeployExtensions({ extBags: [{ ext: kernelExt, pkgDiskInfo }] }))[0]!

  const extPkg: ExtPackage = {
    exts: [kernelExt],
    pkgDiskInfo,
  }
  return {
    enableAndDeployExtensions,
    enableExtensions,
    deployExtensions,
    undeployAndDisableExtension,
    depOrderDeployments,
    extEnv,
    global_env: extEnvVars,
    deplReg,
    depGraph,
    $MAIN_MSGS$,
    pipedMessages$,
    KDeployment,
    pkgMng,
    extPkg,
  }

  async function enableAndDeployExtensions({ extBags }: { extBags: ExtBag[] }) {
    const deployableBags = await enableExtensions({ extBags })
    const _ = await deployExtensions({ deployableBags })
    return _
  }
  async function enableExtensions({ extBags }: { extBags: ExtBag[] }) {
    //FIXME: dependency ordered
    // console.log('enableExtensions', extBags)
    const deployableBags = extBags.map<DeployableBag>(({ ext, pkgDiskInfo, deployWith }) => {
      const extId = ext.id
      const extIdSplit = splitExtId(extId)
      const env = extEnv(extId)
      const $msg$ = new Subject<DataMessage<any>>()

      const push = pushMsg(extId)
      const getExt: Shell['getExt'] = deplReg.get as any

      const onExt: Shell['onExt'] = (extId, cb) => {
        const match = matchMessage<KernelExt>()
        // console.log('onExt', extId)
        const subscription = pipedMessages$.subscribe(msg => {
          // console.log('onExt', msg)

          if (
            !(
              (match(msg, 'moodlenet.kernel@0.1.10::ext/deployed') ||
                match(msg, 'moodlenet.kernel@0.1.10::ext/undeployed')) &&
              isExtIdBWC(msg.data.extId, extId)
            )
          ) {
            return
          }

          cb(getExt(extId))
        })
        return subscription
      }

      function assertMyRegDeployment(prefixErrMsg: string) {
        const myRegDeployment = deplReg.get(extId)
        if (!myRegDeployment) {
          throw new Error(`${prefixErrMsg} ${extId} deployment is missing`)
        }
        return myRegDeployment
      }
      const onExtInstance: Shell['onExtInstance'] = (onExtId, cb) => {
        let cleanup: void | (() => void) = undefined
        const subscription = onExt(onExtId, regDeployment => {
          // console.log('onExtInstance', extId, `[${regDeployment?.extId}]`)
          const myRegDeployment = assertMyRegDeployment(`onExtInstance(${onExtId}) subscription still receiving, but`)
          if (!regDeployment?.inst) {
            return cleanup?.()
          }
          cleanup = cb(regDeployment.inst?.({ depl: myRegDeployment }) /* --- , regDeployment as any */)
        })
        return subscription
      }

      const onExtDeployment: Shell['onExtDeployment'] = (extId, cb) => {
        let cleanup: void | (() => void) = undefined
        const subscription = onExt(extId, regDeployment => {
          if (!regDeployment) {
            return cleanup?.()
          }
          cleanup = cb(regDeployment as any)
        })
        return subscription
      }

      const libOf: Shell['libOf'] = ofExtId => {
        const myRegDeployment = assertMyRegDeployment(`libOf(${ofExtId}), but`)
        return deplReg.get(ofExtId)?.lib?.({ depl: myRegDeployment as any })
      }

      const expose: ExposePointers = expPnt => {
        console.log(`Expose `, extIdSplit.extName, expPnt)
        EXPOSED_POINTERS_REG[extIdSplit.extName] = expPnt
      }

      const shell: Shell = {
        extId,
        env,
        msg$: $msg$.asObservable(),
        // removing `as any` on `push` compiler crashes with "Error: Debug Failure. No error for last overload signature"
        // ::: https://github.com/microsoft/TypeScript/issues/33133  ... related:https://github.com/microsoft/TypeScript/issues/37974
        emit: path => (data, opts) => (push as any)('out')(extId)(path)(data, opts),
        send: destExtId => path => (data, opts) => (push as any)('in')(destExtId)(path)(data, opts),
        push,
        libOf,
        onExtInstance,
        onExtDeployment,
        getExt,
        onExt,
        pkgDiskInfo,
        expose,
        lib: KLib,
      }

      const extDeployable = ext.enable(shell)
      const deployableBag: DeployableBag = {
        extDeployable,
        shell,
        $msg$,
        deployWith,
        ext,
      }
      return deployableBag
    })
    return deployableBags
  }

  async function deployExtensions({ deployableBags }: { deployableBags: DeployableBag[] }): Promise<DeploymentBag[]> {
    const deploymentBagThunks = deployableBags.map<(collect: DeploymentBag[]) => Promise<DeploymentBag[]>>(
      ({ shell, $msg$, extDeployable, deployWith, ext }) =>
        async collect => {
          const extId = shell.extId
          const tearDown = pipedMessages$.subscribe($msg$)

          const deploymentShell: DeploymentShell = {
            tearDown,
          }
          const deployer = deployWith ?? extDeployable.deploy

          const extDeployment = await deployer(deploymentShell, shell)

          const depl: RegDeployment = {
            ...{ deployedWith: deployWith, at: new Date(), ext, $msg$, pkgInfo: shell.pkgDiskInfo },
            ...deploymentShell,
            ...shell,
            ...extDeployment,
            ...extDeployable,
          } as any

          setImmediate(() => {
            /* const msg = */ pushMsg<KernelExt>('moodlenet.kernel@0.1.10')('out')<KernelExt>(
              'moodlenet.kernel@0.1.10',
            )('ext/deployed')({
              extId,
            })
            // console.log('ext/deployed msg', msg)
          })

          deplReg.register({ depl })
          depGraphAddNodes(depGraph, [ext])
          return [
            ...collect,
            {
              depl,
            },
          ]
        },
    )
    const deploymentBagsPr = deploymentBagThunks.reduce((prev, next) => _ => prev(_).then(next))([])
    return deploymentBagsPr
  }

  function pushMsg<Def extends ExtDef>(srcExtId: ExtId<Def>): PushMessage<Def> {
    return bound => destExtId => path => (data, _opts) => {
      console.log('PUSH ---', { bound, destExtId, path, data, _opts }, '--- PUSH')
      const opts: PushOptions = {
        parent: null,
        primary: false,
        sub: false,
        ..._opts,
      }
      const pointer = joinPointer(destExtId, path)
      const destRegDeployment = deplReg.assertDeployed(destExtId)
      // console.log({ EXPOSED_POINTERS_REG, destExtId, path })
      if (opts.primary) {
        const { extName: pushToExtName } = splitExtId(destExtId)
        const expPnt = EXPOSED_POINTERS_REG[pushToExtName]?.[path]
        console.log({ EXPOSED_POINTERS_REG, pushToExtName, destExtId, path })
        if (!expPnt) {
          throw new Error(`pointer ${pointer} is not exposed to primaries`)
        }
        const { valid, msg = '- no details -' } = expPnt.validate(data)
        if (!valid) {
          throw new Error(`data validation didn't pass for ${pointer} : ${msg}`)
        }
      }

      const parentMsgId = opts.parent?.id
      // type DestDef = typeof destExtId extends ExtId<infer Def> ? Def : never
      deplReg.assertDeployed(srcExtId) // assert me deployed

      const msg: MessagePush /* <typeof bound, Def, DestDef, typeof path>  */ = {
        id: newMsgId(),
        source: srcExtId,
        bound,
        pointer,
        data: data as any,
        parentMsgId,
        sub: opts.sub,
        // managedBy: null,
        activeDest: destRegDeployment.ext.id,
      }

      setTimeout(() => $MAIN_MSGS$.next(msg), 10) //FIXME: 😱 why ?
      return msg as any
    }
  }

  function extEnv(extId: ExtId) {
    //FIXME: should check version compat ?
    const { extName /* , version  */ } = splitExtId(extId)
    // console.log('extEnv', extId, extName, global_env, global_env[extName])
    return extEnvVars[extName]
  }

  function undeployAndDisableExtension(extName: ExtName) {
    const mDeployment = undeployExtension(extName)
    return mDeployment && disableExtension(mDeployment)
  }
  function undeployExtension(extName: ExtName) {
    const maybeDeployment = deplReg.unregister(extName)
    maybeDeployment?.tearDown.unsubscribe()
    return maybeDeployment
  }
  function disableExtension(regDeployment: RegDeployment) {
    regDeployment.$msg$.complete()
    return regDeployment
  }

  function depOrderDeployments() {
    return depGraph
      .overallOrder()
      .reverse()
      .map(pushToExtName => {
        const deployment = deplReg.getByName(pushToExtName)
        if (!deployment) {
          //TODO: WARN? THROW? IGNORE?
          return
        }
        return deployment
      })
      .filter((_): _ is RegDeployment => !!_)
  }
}

function newMsgId() {
  return Math.random().toString(36).substring(2)
}
