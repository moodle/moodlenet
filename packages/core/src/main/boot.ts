import assert from 'assert'
import { DepGraph } from 'dependency-graph'
import { resolve } from 'path'
import { mergeMap, of, share, Subject } from 'rxjs'
import { coreExtDef } from '..'
import * as CoreLib from '../core-lib'
import { matchMessage } from '../core-lib/message'
import { isExtIdBWC, joinPointer, splitExtId, splitPointer } from '../core-lib/pointer'
import { depGraphAddNodes } from '../dep-graph'
import * as pkgMngLib from '../pkg-mng/lib'
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
import { createLocalDeploymentRegistry } from './ext-deployment-registry'
import { getMain } from './main'
import { coreExtId } from './pkgJson'

export type Core = Awaited<ReturnType<typeof boot>>
export type BootCfg = {
  mainFolders: MainFolders
  devMode: boolean
}
// export const corePkgInfo: PkgInfo = { name: 'moodlenet-core', version: '0.1.10' }

// type Env = {tmp
// }
// function getEnv(rawExtEnv: RawExtEnv): Env {
//   return rawExtEnv as any //implement checks
// }
export default async function boot(cfg: BootCfg) {
  console.log('boot .... ', cfg)
  const EXPOSED_POINTERS_REG: Record<ExtName, ExposedPointerMap> = {}
  // const _env = getEnv(extEnvVars['moodlenet-core'])
  const main = getMain({ mainFolders: cfg.mainFolders })

  await startup_ensureAllInstalled()

  const deployments = createLocalDeploymentRegistry()

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
            'pkg/getPkgStorageInfos/sub': {
              validate() {
                return { valid: true }
              },
            },
          })
          shell.lib.pubAll<CoreExt>('moodlenet-core@0.1.10', shell, {
            async 'pkg/getPkgStorageInfos'() {
              if (!main.sysPaths.pkgStorageFolder) {
                return { pkgInfos: [] }
              }
              const pkgInfos = await pkgMngLib.getAllPackagesInfo({ absFolder: main.sysPaths.pkgStorageFolder })
              return { pkgInfos }
            },
            'ext/listDeployed'() {
              // console.log({ deployments: deployments.reg })
              const allInfo = Object.values(deployments.reg).map<ExtInfo>(({ ext, installedPackageInfo: pkgInfo }) =>
                ext2ExtInfo({
                  pkgInfo,
                  ext,
                }),
              )
              return allInfo
            },
            async 'pkg/install'({
              msg: {
                data: {
                  req: { installPkgReq },
                },
              },
            }) {
              const installedPackageInfo = await main.pkgMng.install(installPkgReq)
              const extInfos = installedPackageInfo.pkgExport.exts.map<ExtInfo>(ext =>
                ext2ExtInfo({ ext, pkgInfo: installedPackageInfo }),
              )

              const curr = main.getSysConfig()

              main.writeSysConfig({
                ...curr,
                installedPackages: [
                  ...curr.installedPackages,
                  { installationFolder: installedPackageInfo.installationFolder, installPkgReq },
                ],
              })
              return { extInfos }
            },
            async 'ext/deploy'({
              msg: {
                data: {
                  req: { installationFolder, extId },
                },
              },
            }) {
              const installedPackageInfo = await main.pkgMng.getInstalledPackageInfo({ installationFolder })
              const ext = installedPackageInfo.pkgExport.exts.find(ext => ext.id === extId)
              assert(ext, `Couldn't find extId:${extId} in packageId:${installationFolder}`)
              // await deployExtensions({
              //   extBags: [{ ext, pkgInfo: pkgDiskInfo }],
              // })
              const curr = main.getSysConfig()
              main.writeSysConfig({
                ...curr,
                enabledExtensions: [...curr.enabledExtensions, { extId: ext.id, installationFolder }],
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

  const KDeployment = (
    await deployExtensions({
      extBags: [
        {
          extId: coreExtId,
          installedPackageInfo: {
            ...(await main.pkgMng.getInstalledPackageInfo({ installationFolder: resolve(__dirname, '..', '..') })),
            pkgExport: { exts: [coreExt as any] },
          },
        },
      ],
    })
  )[0]!

  await startup_deployAll()

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

  async function deployExtensions({ extBags }: { extBags: ExtBag[] }): Promise<DeploymentBag[]> {
    if (!extBags.length) {
      return []
    }
    //FIXME: dependency ordered
    const deployableBags = extBags.map<DeployableBag>(({ installedPackageInfo, extId: deployExtId, deployWith }) => {
      const ext = installedPackageInfo.pkgExport.exts.find(({ id }) => deployExtId === id)
      assert(ext, `couldn't find ${deployExtId} in ${installedPackageInfo.installationFolder}`)
      console.log('deployExtension', deployExtId)
      const deployExtIdSplit = splitExtId(deployExtId)
      const env = extEnv(deployExtId)
      const $msg$ = new Subject<DataMessage<any>>()

      const push = pushMsg(deployExtId)
      const getExt: Shell['getExt'] = deployments.get as any

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
        const myRegDeployment = deployments.get(deployExtId)
        if (!myRegDeployment) {
          throw new Error(`${prefixErrMsg} ${deployExtId} deployment is missing`)
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
        return deployments.get(ofExtId)?.lib?.({ depl: myRegDeployment as any })
      }

      const expose: ExposePointers = expPnt => {
        console.log(`Expose `, deployExtIdSplit.extName, expPnt)
        EXPOSED_POINTERS_REG[deployExtIdSplit.extName] = expPnt
      }

      const shell: Shell = {
        extId: deployExtId,
        extName: deployExtIdSplit.extName,
        extVersion: deployExtIdSplit.version,
        env,
        msg$: $msg$.asObservable(),
        // removing `as any` on `push` compiler crashes with "Error: Debug Failure. No error for last overload signature"
        // ::: https://github.com/microsoft/TypeScript/issues/33133  ... related:https://github.com/microsoft/TypeScript/issues/37974
        emit: path => (data, opts) => (push as any)('out')(deployExtId)(path)(data, opts),
        send: destExtId => path => (data, opts) => (push as any)('in')(destExtId)(path)(data, opts),
        push,
        libOf,
        onExtInstance,
        onExtDeployment,
        getExt,
        onExt,
        installedPackageInfo,
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
        installedPackageInfo,
      }
      return deployableBag
    })
    const deploymentBagThunks = deployableBags.map<(collect: DeploymentBag[]) => Promise<DeploymentBag[]>>(
      ({ shell, $msg$, extDeployable, deployWith, ext, installedPackageInfo }) =>
        async collect => {
          const extId = shell.extId
          const tearDown = pipedMessages$.subscribe($msg$)

          const deploymentShell: DeploymentShell = {
            tearDown,
          }
          const deployer = deployWith ?? extDeployable.deploy

          const extDeployment = await deployer(deploymentShell, shell)

          const depl: RegDeployment = {
            ...{ deployedWith: deployWith, at: new Date(), ext, $msg$, installedPackageInfo },
            ...(deploymentShell as any),
            ...shell,
            ...extDeployment,
            ...extDeployable,
          }

          setImmediate(() => {
            /* const msg = */ pushMsg<CoreExt>('moodlenet-core@0.1.10')('out')<CoreExt>('moodlenet-core@0.1.10')(
              'ext/deployed',
            )({
              extId,
            })
            // console.log('ext/deployed msg', msg)
          })

          deployments.register({ depl })
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
    const deployment = deployments.unregister(extName)
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
      const destRegDeployment = deployments.assertDeployed(destExtId)
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
      deployments.assertDeployed(srcExtId) // assert me deployed

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
    return main.getLocalDeplConfig().extensions[extName]?.config
  }

  function depOrderDeployments() {
    return depGraph
      .overallOrder()
      .reverse()
      .map(pushToExtName => {
        const deployment = deployments.getByName(pushToExtName)
        if (!deployment) {
          //TODO: WARN? THROW? IGNORE?
          return
        }
        return deployment
      })
      .filter((_): _ is RegDeployment => !!_)
  }

  async function startup_ensureAllInstalled() {
    const allInstalledFolders = (await main.pkgMng.getAllInstalledPackagesInfo()).map(
      ({ installationFolder }) => installationFolder,
    )
    const toInstallReq = main
      .getSysConfig()
      .installedPackages.filter(({ installationFolder }) => !allInstalledFolders.includes(installationFolder))
      .map(({ installPkgReq, installationFolder }) => ({ installPkgReq, installationFolder }))

    await Promise.all(
      toInstallReq.map(({ installPkgReq, installationFolder }) =>
        main.pkgMng.install(installPkgReq, installationFolder),
      ),
    )
  }

  async function startup_deployAll() {
    const extBags = await Promise.all(
      main
        .getSysConfig()
        .enabledExtensions.filter(({ extId }) => extId !== coreExtId)
        .map(async ({ extId, installationFolder }) => {
          const installedPackageInfo = await main.pkgMng.getInstalledPackageInfo({ installationFolder })
          return { extId, installedPackageInfo }
        }),
    )

    return deployExtensions({ extBags })
  }
}

function newMsgId() {
  return Math.random().toString(36).substring(2)
}

// async function configWatcher({ curr, prev, type }: ChangedConfigArg) {
//   if (type === 'sys') {
//     if (curr.__FIRST_INSTALL) {
//       console.log(`sysConfig.__FIRST_INSTALL`)

//       main.configs.writeSysConfig({
//         ...curr,
//         __FIRST_INSTALL: undefined,
//       })
//     }

//     const deployEntries = Object.entries(curr.enabledExtensions)
//       .filter(([extName]) => extName !== coreExtName)
//       .filter(([extName]) => !prev || !(extName in prev.enabledExtensions))
//     console.log({ deployEntries })

//     const deployments = await deployExtensions({
//       extBags: deployEntries.map<ExtBag>(([extName, sysEnabledExtDecl]) => {
//         const { pkgDiskInfo, pkgExport } = main.main.pkgMng.extractPackage(sysEnabledExtDecl.pkg)
//         const ext = pkgExport.exts.find(({ id }) => splitExtId(id).extName === extName)
//         assert(ext, `could not find ext:${extName} in pkg:${sysEnabledExtDecl.pkg}`)
//         return {
//           ext,
//           pkgInfo: pkgDiskInfo,
//         }
//       }),
//     })
//     console.log({ deployments })

//     const installEntries = Object.entries(curr.installedPackages)
//       .filter(([pkgName]) => pkgName !== pkgInfo.name)
//       .filter(([pkgName]) => !prev || !(pkgName in prev.installedPackages))
//     console.log({ installEntries })
//     const extInfos = await Promise.all(
//       installEntries.map(async ([pkgName, sysPkgDecl]) => {
//         const { pkgDiskInfo, pkgExport } = await main.main.pkgMng.install({ ...sysPkgDecl, name: pkgName })
//         const extInfos = pkgExport.exts.map<ExtInfo>(ext => ext2ExtInfo({ ext, pkgInfo: pkgDiskInfo }))
//         return { extInfos }
//       }),
//     )

//     console.log({ extInfosInstalll: extInfos })
//     if (prev) {
//       const undeployEntries = Object.entries(prev.enabledExtensions)
//         .filter(([extName]) => extName !== coreExtName)
//         .filter(([extName]) => !(extName in curr.enabledExtensions))
//       console.log({ undeployEntries })
//     }
//   }
// }
