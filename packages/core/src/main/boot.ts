import assert from 'assert'
import { DepGraph } from 'dependency-graph'
import { mergeMap, of, share, Subject } from 'rxjs'
import { coreExtDef } from '..'
import * as CoreLib from '../core-lib'
import { matchMessage } from '../core-lib/message'
import { isExtIdBWC, joinPointer, splitExtId, splitPointer } from '../core-lib/pointer'
import { depGraphAddNodes } from '../dep-graph'
import type {
  CoreExt,
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
  ExtInfo,
  ExtName,
  MessagePush,
  MWFn,
  PushMessage,
  PushOptions,
  RegDeployment,
  Shell,
} from '../types'
import { MainFolders } from '../types/sys'
import { ext2ExtInfo } from '../util/ext'
import { ChangedConfigArg } from './configs'
import { getMain } from './main'
import { coreExtName, pkgInfo } from './pkgJson'

export type Core = Awaited<ReturnType<typeof boot>>
export type BootCfg = {
  folders: MainFolders
  devMode: boolean
}
// export const corePkgInfo: PkgInfo = { name: 'moodlenet-core', version: '0.1.10' }

// type Env = {
// }
// function getEnv(rawExtEnv: RawExtEnv): Env {
//   return rawExtEnv as any //implement checks
// }
export default async function boot(cfg: BootCfg) {
  console.log('boot .... ', cfg)
  const EXPOSED_POINTERS_REG: Record<ExtName, ExposedPointerMap> = {}
  // const _env = getEnv(extEnvVars['moodlenet-core'])

  const main = getMain({ folders: cfg.folders })

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

  const coreExt: Ext<CoreExt> = {
    ...coreExtDef,
    enable: shell => {
      return {
        deploy(
          {
            /* , tearDown  */
          },
        ) {
          shell.expose({
            'ext/listDeployed/sub': {
              validate() {
                return { valid: true }
              },
            },
            'pkg/install/sub': {
              validate() {
                return { valid: true }
              },
            },
            'ext/deploy/sub': {
              validate() {
                return { valid: true }
              },
            },
          })
          shell.lib.pubAll<CoreExt>('moodlenet-core@0.1.10', shell, {
            'ext/listDeployed'() {
              // console.log({ main.deployments: main.deployments.reg })
              const allInfo = Object.values(main.deployments.reg).map<ExtInfo>(({ ext, pkgInfo }) =>
                ext2ExtInfo({
                  pkgInfo,
                  ext,
                }),
              )
              return allInfo
            },
            async 'pkg/install'({
              msg: {
                data: { req: sysPkg },
              },
            }) {
              const { pkgDiskInfo, pkgExport } = await main.pkgMng.install(sysPkg)
              const extInfos = pkgExport.exts.map<ExtInfo>(ext => ext2ExtInfo({ ext, pkgInfo: pkgDiskInfo }))

              const curr = main.configs.getSysConfig()
              const { name, ...sysPkgDecl } = sysPkg
              main.configs.writeSysConfig({
                ...curr,
                installedPackages: {
                  ...curr.installedPackages,
                  [name]: sysPkgDecl,
                },
              })
              return { extInfos }
            },
            async 'ext/deploy'({
              msg: {
                data: {
                  req: { pkgName, extId },
                },
              },
            }) {
              const { /* pkgDiskInfo,  */ pkgExport } = await main.pkgMng.extractPackage(pkgName)
              const ext = pkgExport.exts.find(ext => ext.id === extId)
              assert(ext, `Couldn't find extId:${extId} in package:${pkgName}`)
              // await deployExtensions({
              //   extBags: [{ ext, pkgInfo: pkgDiskInfo }],
              // })
              const { extName, version } = splitExtId(ext.id)
              const curr = main.configs.getSysConfig()
              main.configs.writeSysConfig({
                ...curr,
                enabledExtensions: {
                  ...curr.enabledExtensions,
                  [extName]: { pkg: pkgName, version },
                },
              })
              return
            },
          })
          return {}
        },
      }
    },
  }
  // depGraphAddNodes(depGraph, [coreExt])
  // const pkgDiskInfo = pkgDiskInfoOf(__filename)
  const KDeployment = (await deployExtensions({ extBags: [{ ext: coreExt, pkgInfo }] }))[0]!
  main.configs.setupWatcher(configWatcher)
  return {
    coreExt,
    KDeployment,
    deployExtensions,
    undeployExtension,
    depOrderDeployments,
    extEnv,
    depGraph,
    $MAIN_MSGS$,
    pipedMessages$,
  }
  async function configWatcher({ curr, prev, type }: ChangedConfigArg) {
    if (type === 'sys') {
      if (curr.__FIRST_INSTALL) {
        console.log(`sysConfig.__FIRST_INSTALL`)

        main.configs.writeSysConfig({
          ...curr,
          __FIRST_INSTALL: undefined,
        })
      }

      const deployEntries = Object.entries(curr.enabledExtensions)
        .filter(([extName]) => extName !== coreExtName)
        .filter(([extName]) => !prev || !(extName in prev.enabledExtensions))
      console.log({ deployEntries })

      const deployments = await deployExtensions({
        extBags: deployEntries.map<ExtBag>(([extName, sysEnabledExtDecl]) => {
          const { pkgDiskInfo, pkgExport } = main.pkgMng.extractPackage(sysEnabledExtDecl.pkg)
          const ext = pkgExport.exts.find(({ id }) => splitExtId(id).extName === extName)
          assert(ext, `could not find ext:${extName} in pkg:${sysEnabledExtDecl.pkg}`)
          return {
            ext,
            pkgInfo: pkgDiskInfo,
          }
        }),
      })
      console.log({ deployments })

      const installEntries = Object.entries(curr.installedPackages)
        .filter(([pkgName]) => pkgName !== pkgInfo.name)
        .filter(([pkgName]) => !prev || !(pkgName in prev.installedPackages))
      console.log({ installEntries })
      const extInfos = await Promise.all(
        installEntries.map(async ([pkgName, sysPkgDecl]) => {
          const { pkgDiskInfo, pkgExport } = await main.pkgMng.install({ ...sysPkgDecl, name: pkgName })
          const extInfos = pkgExport.exts.map<ExtInfo>(ext => ext2ExtInfo({ ext, pkgInfo: pkgDiskInfo }))
          return { extInfos }
        }),
      )

      console.log({ extInfosInstalll: extInfos })
      if (prev) {
        const undeployEntries = Object.entries(prev.enabledExtensions)
          .filter(([extName]) => extName !== coreExtName)
          .filter(([extName]) => !(extName in curr.enabledExtensions))
        console.log({ undeployEntries })
      }
    }
  }
  async function deployExtensions({ extBags }: { extBags: ExtBag[] }): Promise<DeploymentBag[]> {
    if (!extBags.length) {
      return []
    }
    //FIXME: dependency ordered
    const deployableBags = extBags.map<DeployableBag>(({ ext, pkgInfo, deployWith }) => {
      console.log('deployExtension', ext.id)
      const extId = ext.id
      const extIdSplit = splitExtId(extId)
      const env = extEnv(extId)
      const $msg$ = new Subject<DataMessage<any>>()

      const push = pushMsg(extId)
      const getExt: Shell['getExt'] = main.deployments.get as any

      const onExt: Shell['onExt'] = (extId, cb) => {
        const match = matchMessage<CoreExt>()
        // console.log('onExt', extId)
        // FIXME: beware that immediate_deployment stays in memoruy this way - fix it
        const immediate_deployment = getExt(extId)
        if (immediate_deployment) {
          setImmediate(() => {
            // console.log('onExt::', extId, 'immediate')
            cb(immediate_deployment as any)
          })
        }
        const subscription = pipedMessages$.subscribe(msg => {
          if (
            !(
              (match(msg, 'moodlenet-core@0.1.10::ext/deployed') ||
                match(msg, 'moodlenet-core@0.1.10::ext/undeployed')) &&
              isExtIdBWC(msg.data.extId, extId)
            )
          ) {
            return
          }

          const def_deployment = getExt(extId)
          if (immediate_deployment === def_deployment) {
            return
          }
          // console.log('onExt::', extId, 'pipedMessages$', msg.pointer)
          cb(getExt(extId))
        })
        return subscription
      }

      function assertMyRegDeployment(prefixErrMsg: string) {
        const myRegDeployment = main.deployments.get(extId)
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
        return main.deployments.get(ofExtId)?.lib?.({ depl: myRegDeployment as any })
      }

      const expose: ExposePointers = expPnt => {
        console.log(`Expose `, extIdSplit.extName, expPnt)
        EXPOSED_POINTERS_REG[extIdSplit.extName] = expPnt
      }

      const shell: Shell = {
        extId,
        extName: extIdSplit.extName,
        extVersion: extIdSplit.version,
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
        pkgInfo,
        expose,
        lib: CoreLib,
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
            ...{ deployedWith: deployWith, at: new Date(), ext, $msg$, pkgInfo: shell.pkgInfo },
            ...deploymentShell,
            ...shell,
            ...extDeployment,
            ...extDeployable,
          } as any

          setImmediate(() => {
            /* const msg = */ pushMsg<CoreExt>('moodlenet-core@0.1.10')('out')<CoreExt>('moodlenet-core@0.1.10')(
              'ext/deployed',
            )({
              extId,
            })
            // console.log('ext/deployed msg', msg)
          })

          main.deployments.register({ depl })
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

  function undeployExtension(extName: ExtName) {
    const deployment = main.deployments.unregister(extName)
    assert(deployment, `couldn't find deployment for ${extName}`)
    deployment.tearDown.unsubscribe()
    deployment.$msg$.complete()
    return deployment
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
      const destRegDeployment = main.deployments.assertDeployed(destExtId)
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
      main.deployments.assertDeployed(srcExtId) // assert me deployed

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
    // console.log('extEnv', extId, extName, extEnvVars, extEnvVars[extName])
    return main.configs.getLocalDeplConfig().extensions[extName]?.config
  }

  function depOrderDeployments() {
    return depGraph
      .overallOrder()
      .reverse()
      .map(pushToExtName => {
        const deployment = main.deployments.getByName(pushToExtName)
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
