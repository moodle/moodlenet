import assert from 'assert'
import { DepGraph } from 'dependency-graph'
import { resolve } from 'path'
import { mergeMap, of, share, Subject } from 'rxjs'
import { coreExtDef } from '..'
import * as CoreLib from '../core-lib'
import { matchMessage } from '../core-lib/message'
import { isExtIdBWC, joinPointer, splitExtId, splitPointer } from '../core-lib/pointer'
import { depGraphAddNodes, depGraphRm } from '../dep-graph'
import * as pkgMngLib from '../pkg-mng/lib'
import type {
  Boot,
  BootExt,
  CoreExt,
  DataMessage,
  DepGraphData,
  ExposedPointerMap,
  Ext,
  ExtDef,
  ExtId,
  ExtName,
  MessagePush,
  MWFn,
  PackageInfo,
  PkgInstallationId,
  PushOptions,
  RawShell,
  RegItem,
  Shell,
} from '../types'
import { createLocalDeploymentRegistry } from './ext-deployment-registry'
import { getMain } from './main'
import { coreExtName } from './pkgJson'

export type Core = Awaited<ReturnType<typeof boot>>

// export const corePkgInfo: PkgInfo = { name: '@moodlenet/core', version: '0.1.0' }

// type Env = {tmp
// }
// function getEnv(rawExtEnv: RawExtEnv): Env {
//   return rawExtEnv as any //implement checks
// }
// process.on('uncaughtException', e => {
//   console.error(`***\n***\n***\nUNCAUGHT EXCEPTION:***\n***\n***\n`, e)
// })
const boot: Boot = async cfg => {
  console.log('boot .... ', cfg)
  const EXPOSED_POINTERS_REG: Record<ExtName, ExposedPointerMap> = {}
  // const _env = getEnv(extEnvVars['@moodlenet/core'])
  const main = getMain({ mainFolders: cfg.mainFolders })

  await startup_ensureAllInstalled()

  const deployments = createLocalDeploymentRegistry()

  const depGraph = new DepGraph<DepGraphData>()
  const $MAIN_MSGS$ = new Subject<DataMessage<any>>()
  const pipedMessages$ = $MAIN_MSGS$.pipe(
    // tap(msg => console.log('++++++msg', msg)),
    mergeMap(msg => {
      const orderDepl = depOrderDeployments()
      console.log({ orderDepl })
      if (msg.bound === 'in') {
        const { extName: msgExtName } = splitExtId(splitPointer(msg.pointer).extId)
        const destDeplIndex = orderDepl.findIndex(({ shell: { extId } }) => {
          const { extName: thisExtName } = splitExtId(extId)
          return thisExtName === msgExtName
        })
        if (destDeplIndex < 0) {
          console.error({ msg, destDeplIndex, msgExtName })
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
    wireup: async shell => {
      return {
        async deploy(
          {
            /* , tearDown  */
          },
        ) {
          const assumeValid = { validate: () => ({ valid: true }) }
          shell.expose({
            'ext/listDeployed/sub': assumeValid,
            'pkg/install/sub': assumeValid,
            'pkg/uninstall/sub': assumeValid,
            // 'ext/deploy/sub': assumeValid,
            'pkg/getPkgStorageInfos/sub': assumeValid,
          })

          shell.provide.services({
            async 'pkg/getInstalledPackages'() {
              const pkgInfos = await main.pkgMng.getAllPackagesInfo()

              return {
                pkgInfos,
              }
            },
            async 'pkg/getPkgStorageInfos'() {
              if (!main.sysPaths.pkgStorageFolder) {
                return { pkgInfos: [] }
              }
              const pkgInfos = await pkgMngLib.getAllPackagesInfo({ absFolder: main.sysPaths.pkgStorageFolder })
              return { pkgInfos }
            },
            'ext/listDeployed'() {
              // console.log({ deployments: deployments.reg })
              const pkgInfos = Object.values(deployments.reg).map<PackageInfo>(({ pkgInfo }) => pkgInfo)
              return [{ pkgInfos }]
            },
            async 'pkg/install'({
              msg: {
                data: {
                  req: { installPkgReq },
                },
              },
            }) {
              if (installPkgReq.type === 'symlink') {
                assert(
                  !!main.sysPaths.pkgStorageFolder,
                  `can't install symlink without a base package storage folder configured`,
                )
                installPkgReq.fromFolder = resolve(main.sysPaths.pkgStorageFolder, installPkgReq.fromFolder)
              }
              console.log('installPkgReq ...', installPkgReq)
              const { pkgInfo } = await main.pkgMng.install(installPkgReq)

              const oldSysConfig = main.readSysConfig()

              main.writeSysConfig({
                ...oldSysConfig,
                packages: {
                  ...oldSysConfig.packages,
                  [pkgInfo.id]: { configs: {} },
                },
              })
              await deployExtension({ pkgInstallationId: pkgInfo.id, install: true })

              return { pkgInfo }
            },
            async 'pkg/uninstall'({
              msg: {
                data: {
                  req: { pkgInstallationId },
                },
              },
            }) {
              console.log('uninstallPkg...', pkgInstallationId)
              // const installedPackageInfo = await main.pkgMng.getPackageInfo({
              //   pkgInstallationId,
              // })
              const depl = deployments.getByPkgInstallationId(pkgInstallationId)
              assert(depl, 'no deployment for ${installationFolder}')
              undeployExtension(depl.ext)
              await depl.ext.uninstall?.(depl)
              await main.pkgMng.uninstall({ pkgInstallationId })

              const oldSysConfig = main.readSysConfig()
              const newPackages = { ...oldSysConfig.packages }
              delete newPackages[pkgInstallationId]
              main.writeSysConfig({
                ...oldSysConfig,
                packages: newPackages,
              })

              return
            },
            // async 'ext/deploy'({
            //   msg: {
            //     data: {
            //       req: { installationFolder, extId },
            //     },
            //   },
            // }) {
            //   const installedPackageInfo = await main.pkgMng.getInstalledPackageInfo({
            //     pkgInstallationId: installationFolder,
            //   })
            //   const ext = installedPackageInfo.pkgExport.exts.find(ext => ext.id === extId)
            //   assert(ext, `Couldn't find extId:${extId} in packageId:${installationFolder}`)
            //   await deployExtensions({
            //     extBags: [{ installedPackageInfo, extId }],
            //   })
            //   const curr = main.readSysConfig()
            //   main.writeSysConfig({
            //     ...curr,
            //     enabledPackages: [...curr.enabledPackages, { extId: ext.id, installationFolder }],
            //   })

            //   return
            // },
          })
          return {}
        },
      }
    },
  }
  // depGraphAddNodes(_depGraph, [coreExt])
  // const pkgDiskInfo = pkgDiskInfoOf(__filename)

  /* const KDeployment =  */
  const pkgInfo = await pkgMngLib.getPackageInfo({ absFolder: resolve(__dirname, '..', '..') })
  await deployModule({ env: null, ext: coreExt, pkgInfo })

  await startup_deployAll()

  return {
    async tearDown() {
      $MAIN_MSGS$.complete()
    },
  }

  // return {
  //   coreExt,
  //   KDeployment,
  //   deployExtension,
  //   undeployExtension,
  //   depOrderDeployments,
  //   extPkgConfig,
  //   depGraph,
  //   $MAIN_MSGS$,
  //   pipedMessages$,
  // }

  type DeploymentBag = { regDeployment: RegItem<any> }
  async function deployExtension({
    pkgInstallationId,
    install = false,
  }: {
    install?: boolean
    pkgInstallationId: PkgInstallationId
  }): Promise<DeploymentBag> {
    const { env, proxyDeploy } = extPkgConfig(pkgInstallationId)
    const { ext, pkgInfo } = await main.pkgMng.getPkg({ pkgInstallationId })
    return deployModule({
      env: env?.env,
      ext,
      pkgInfo,
      proxyDeploy,
      install,
    })
  }
  async function deployModule({
    ext,
    install,
    pkgInfo,
    env,
    proxyDeploy,
  }: {
    proxyDeploy?: boolean
    env: unknown
    pkgInfo: PackageInfo
    ext: Ext<any>
    install?: boolean
  }) {
    const extId: ExtId = `${ext.name}@${ext.version}`
    const $msg$ = new Subject<DataMessage<any>>()
    const shell = getShell({ extId, $msg$, env, pkgInfo })

    if (install) {
      await ext.install?.(shell)
    }

    const extDeployable = await ext.wireup(shell)

    // const deployableBag: DeployableBag = {
    //   extDeployable,
    //   shell,
    //   $msg$,
    //   deployWith,
    //   ext: module,
    //   installedPackageInfo,
    // }

    assert(!proxyDeploy, `config.proxyDeploy not implemented`)

    const deployer = proxyDeploy ? extDeployable?.deploy : extDeployable?.deploy

    const extDeployment = await (deployer ? deployer(shell) : void 0)

    const regDeployment: RegItem<any> = {
      ...{ deployer, at: new Date(), ext: ext, $msg$, pkgInfo },
      ...(extDeployable ?? null),
      ...(extDeployment ?? null),
      shell,
    }
    deployments.register({ regDeployment })
    console.log({ name: ext.name, coreExtName })
    if (ext.name !== coreExtName) {
      // setTimeout(() => {
      /* const msg = */ pushMsg<CoreExt>('@moodlenet/core@0.1.0')('out')<CoreExt>('@moodlenet/core@0.1.0')(
        'ext/deployed',
      )({
        extId,
      })
      // console.log('ext/deployed msg', msg)
      // }, 1000)
    }

    depGraphAddNodes(depGraph, [ext])

    return { regDeployment }
  }

  function getShell({
    $msg$,
    env,
    extId,
    pkgInfo,
  }: {
    pkgInfo: PackageInfo
    extId: ExtId
    $msg$: Subject<DataMessage<any>>
    env: unknown
  }): Shell<any> {
    const push = pushMsg(extId)
    const getExt: RawShell['getExt'] = deployments.getByExtId as any
    const tearDown = pipedMessages$.subscribe($msg$)

    const onExt: RawShell['onExt'] = (extId, cb) => {
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
            (match(msg, '@moodlenet/core@0.1.0::ext/deployed') ||
              match(msg, '@moodlenet/core@0.1.0::ext/undeployed')) &&
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

    // function assertMyRegDeployment(prefixErrMsg: string) {
    //   const myRegDeployment = deployments.get(myDeployExtId)
    //   assert(myRegDeployment, `${prefixErrMsg} my ${myDeployExtId} deployment is missing`)
    //   return myRegDeployment
    // }
    const onExtInstance: RawShell['onExtInstance'] = (onExtId, cb) => {
      let cleanup: void | (() => void) = undefined
      const subscription = onExt(onExtId, regDeployment => {
        // console.log('onExtInstance', extId, `[${regDeployment?.extId}]`)
        // const myRegDeployment = assertMyRegDeployment(`onExtInstance(${onExtId}) subscription still receiving, but`)
        const sub = onExtDeployment(extId, myRegDeployment => {
          sub.unsubscribe()
          if (!regDeployment?.plug) {
            return cleanup?.()
          }
          cleanup = cb(regDeployment.plug({ depl: myRegDeployment }) /* --- , regDeployment as any */)
        })
      })
      return subscription
    }

    const onExtDeployment: RawShell['onExtDeployment'] = (extId, cb) => {
      let cleanup: void | (() => void) = undefined
      const subscription = onExt(extId, regDeployment => {
        if (!regDeployment) {
          return cleanup?.()
        }
        cleanup = cb(regDeployment as any)
      })
      return subscription
    }

    const libOf: RawShell['libOf'] = ofExtId =>
      new Promise((resolve, reject) => {
        // const myRegDeployment = assertMyRegDeployment(`libOf(${ofExtId}), but`)
        const sub = onExtDeployment(extId, myRegDeployment => {
          sub.unsubscribe()
          resolve(deployments.get(ofExtId)?.lib?.({ depl: myRegDeployment as any }))
          return reject
        })
      })

    const expose: RawShell['expose'] = expPnt => {
      console.log(`Expose `, pkgInfo.packageJson.name, expPnt)
      EXPOSED_POINTERS_REG[pkgInfo.packageJson.name] = expPnt
    }

    const _rawShell: RawShell = {
      extId: extId,
      tearDown,
      extName: pkgInfo.packageJson.name,
      extVersion: pkgInfo.packageJson.version,
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
    return {
      _raw: _rawShell,
      tearDown: _rawShell.tearDown,
      emit: _rawShell.emit,
      msg$: _rawShell.msg$,
      lib: _rawShell.lib,
      env: _rawShell.env,
      getExt: _rawShell.getExt,
      rx: _rawShell.lib.rx,
      expose: _rawShell.expose,
      extId: _rawShell.extId,
      extName: _rawShell.extName,
      extVersion: _rawShell.extVersion,
      plugin: _rawShell.onExtInstance,
      access(targetExtId) {
        return CoreLib.access(targetExtId, _rawShell)
      },
      me: CoreLib.access<any>(extId, _rawShell),
      provide: CoreLib.provide(extId, _rawShell),
    }
  }

  function undeployExtension(ext: Ext) {
    const regItem = deployments.unregister(ext.name)
    assert(regItem, `couldn't find deployment for ${ext.name}`)
    regItem.$msg$.complete()
    regItem.shell.tearDown.unsubscribe()
    depGraphRm(depGraph, [ext], [])
    return regItem
  }

  function pushMsg<Def extends ExtDef>(srcExtId: ExtId<Def>): RawShell<Def>['push'] {
    return bound => destExtId => path => (data, _opts) => {
      console.log('PUSH ---', { bound, destExtId, path, data, _opts }, '--- PUSH')
      const opts: PushOptions = {
        parent: null,
        primary: false,
        sub: false,
        ..._opts,
      }
      const pointer = joinPointer(destExtId, path)
      const destRegItem = deployments.assertDeployed(destExtId)
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
        activeDest: destRegItem.shell.extId,
      }

      setTimeout(() => $MAIN_MSGS$.next(msg), 10) //FIXME: 😱 why ?
      return msg as any
    }
  }

  function extPkgConfig(pkgInstallationId: PkgInstallationId) {
    const pkgSys = main.readSysConfig().packages[pkgInstallationId]
    assert(pkgSys, `could not find pkgSys for ${pkgInstallationId}`)
    const mnDeplClass = process.env.MN_DEPL_CLASS ?? 'default'
    const config = pkgSys.configs[mnDeplClass]
    return { ...pkgSys, ...config }
  }

  function depOrderDeployments() {
    return depGraph
      .overallOrder()
      .reverse()
      .map(pushToExtName => {
        const deployment = deployments.get(pushToExtName)
        if (!deployment) {
          //TODO: WARN? THROW? IGNORE?
          return
        }
        return deployment
      })
      .filter((_): _ is RegItem => !!_)
  }

  async function startup_ensureAllInstalled() {
    const allPackagesInfos = await main.pkgMng.getAllPackagesInfo()
    const allPackagesIds = allPackagesInfos.map(({ id }) => id)

    const toInstallIds = Object.keys(main.readSysConfig().packages).filter(
      pkgInstallationId => !allPackagesIds.includes(pkgInstallationId),
    )

    const toInstallPackagesInfos = allPackagesInfos.filter(({ id }) => toInstallIds.includes(id))

    await Promise.all(toInstallPackagesInfos.map(({ id, installPkgReq }) => main.pkgMng.install(installPkgReq, id)))
  }

  async function startup_deployAll() {
    const startPkgs = (
      await Promise.all(
        Object.keys(main.readSysConfig().packages).map(async pkgInstallationId => {
          const pkgInfo = await main.pkgMng.getPackageInfo({
            pkgInstallationId,
          })
          return { pkgInfo }
        }),
      )
    ).filter(({ pkgInfo }) => pkgInfo.packageJson.name !== coreExtName)
    console.log(
      'startup_deployAll',
      startPkgs.map(_ => _.pkgInfo.packageJson.name),
    )
    return Promise.all(startPkgs.map(_ => deployExtension({ pkgInstallationId: _.pkgInfo.id })))
  }
}
const mainExt: BootExt = {
  boot,
}
export default mainExt

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

// type ExtBag = { installedPackageInfo: PkgInstallationInfo; extId: ExtId; deployWith?: ExtDeploy }
