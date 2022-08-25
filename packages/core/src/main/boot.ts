import assert from 'assert'
import { DepGraph } from 'dependency-graph'
import { resolve } from 'path'
import { mergeMap, of, share, Subject } from 'rxjs'
import { inspect } from 'util'
import { coreExtDef } from '..'
import * as CoreLib from '../core-lib'
import { matchMessage } from '../core-lib/message'
import { isExtIdBWC, joinPointer, splitExtId, splitPointer } from '../core-lib/pointer'
import { depGraphAddNodes, depGraphRm } from '../dep-graph'
import * as pkgMngLib from '../pkg-mng/lib'
import type {
  Boot,
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

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  process.exit()
})
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
  const EXPOSED_POINTERS_REG: Record<ExtName, ExposedPointerMap> = {}
  // const _env = getEnv(extEnvVars['@moodlenet/core'])
  const main = getMain({ mainFolders: cfg.mainFolders })
  const sysconfig = main.readSysConfig()
  const { __FIRST_RUN__ } = sysconfig
  if (__FIRST_RUN__) {
    main.writeSysConfig({
      ...sysconfig,
      __FIRST_RUN__: undefined,
    })
  }
  await startup_ensureAllInstalled()

  const deployments = createLocalDeploymentRegistry()

  const depGraph = new DepGraph<DepGraphData>()
  const $MAIN_MSGS$ = new Subject<DataMessage<any>>()
  const pipedMessages$ = $MAIN_MSGS$.pipe(
    mergeMap(msg => {
      const orderDepl = depOrderDeployments()
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
      return orderDepl
        .map(({ mw }) => mw)
        .filter((mw): mw is MWFn => !!mw)
        .reduce(($, mwFn) => $.pipe(mergeMap(mwFn)), of(msg))
    }),
    share(),
  )

  const coreExt: Ext<CoreExt> = {
    ...coreExtDef,
    connect: shell => {
      return {
        deploy: () => {
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
              const pkgInfos = Object.values(deployments.reg).map<PackageInfo>(({ pkgInfo }) => pkgInfo)
              return [{ pkgInfos }]
            },
            async 'pkg/install'({ installPkgReq }) {
              if (installPkgReq.type === 'symlink') {
                assert(
                  !!main.sysPaths.pkgStorageFolder,
                  `can't install symlink without a base package storage folder configured`,
                )
                installPkgReq.fromFolder = resolve(main.sysPaths.pkgStorageFolder, installPkgReq.fromFolder)
              }
              const { pkgInfo, date } = await main.pkgMng.install(installPkgReq)

              const oldSysConfig = main.readSysConfig()

              main.writeSysConfig({
                ...oldSysConfig,
                packages: {
                  ...oldSysConfig.packages,
                  [pkgInfo.id]: { env: {}, date, installPkgReq },
                },
              })
              const {
                regDeployment: {
                  shell: { extId: installedExtId },
                },
              } = await deployExtension({ pkgInstallationId: pkgInfo.id, install: true })
              shell.emit('pkg/installed')({ extId: installedExtId })

              return { pkgInfo }
            },
            async 'pkg/uninstall'({ pkgInstallationId }) {
              // const installedPackageInfo = await main.pkgMng.getPackageInfo({
              //   pkgInstallationId,
              // })
              const depl = deployments.getByPkgInstallationId(pkgInstallationId)
              assert(depl, 'no deployment for ${installationFolder}')
              undeployExtension(depl.ext)
              await depl.uninstall?.()
              await main.pkgMng.uninstall({ pkgInstallationId })

              const oldSysConfig = main.readSysConfig()
              const newPackages = { ...oldSysConfig.packages }
              delete newPackages[pkgInstallationId]
              main.writeSysConfig({
                ...oldSysConfig,
                packages: newPackages,
              })
              shell.emit('pkg/uninstalled')({ extId: depl.shell.extId })
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
    const env = pkgEnv(pkgInstallationId)
    const { ext, pkgInfo } = await main.pkgMng.getPkg({ pkgInstallationId })
    return deployModule({
      env,
      ext,
      pkgInfo,
      install,
    })
  }
  async function deployModule({
    ext,
    install,
    pkgInfo,
    env,
  }: {
    env: unknown
    pkgInfo: PackageInfo
    ext: Ext<any>
    install?: boolean
  }) {
    const extId: ExtId = `${ext.name}@${ext.version}`
    const $msg$ = new Subject<DataMessage<any>>()
    const shell = getShell({ ext, extId, $msg$, env, pkgInfo })
    const extConn = await ext.connect(shell)

    if (install) {
      await extConn.install?.()
    }

    const extDeployable = await extConn.deploy()

    // const deployableBag: DeployableBag = {
    //   extDeployable,
    //   shell,
    //   $msg$,
    //   deployWith,
    //   ext: module,
    //   installedPackageInfo,
    // }

    const regDeployment: RegItem<any> = {
      ...extConn,
      ...{ at: new Date(), ext: ext, $msg$, pkgInfo },
      ...(extDeployable ?? null),
      shell,
    }
    deployments.register({ regDeployment })
    if (ext.name !== coreExtName) {
      pushMsg<CoreExt>('@moodlenet/core@0.1.0')('out')<CoreExt>('@moodlenet/core@0.1.0')('ext/deployed')({
        extId,
      })
    }

    depGraphAddNodes(depGraph, [ext])

    return { regDeployment }
  }

  function getShell({
    $msg$,
    env,
    ext,
    extId,
    pkgInfo,
  }: {
    ext: Ext
    pkgInfo: PackageInfo
    extId: ExtId
    $msg$: Subject<DataMessage<any>>
    env: unknown
  }): Shell<any> {
    const push = pushMsg(extId)
    const getExt: RawShell['getExt'] = deployments.getByExtId as any
    const tearDown = pipedMessages$.subscribe($msg$)
    const onExtInstalled: RawShell['onExtInstalled'] = cb => {
      const match = matchMessage<CoreExt>()
      const subscription = pipedMessages$.subscribe(msg => {
        if (!match(msg, '@moodlenet/core@0.1.0::pkg/installed')) {
          return
        }

        const { extName, version } = splitExtId(msg.data.extId)
        cb({ extId: msg.data.extId, extName, extVersion: version })
      })
      return subscription
    }
    const onExtUninstalled: RawShell['onExtUninstalled'] = cb => {
      const match = matchMessage<CoreExt>()
      const subscription = pipedMessages$.subscribe(msg => {
        if (!match(msg, '@moodlenet/core@0.1.0::pkg/uninstalled')) {
          return
        }
        const { extName, version } = splitExtId(msg.data.extId)
        cb({ extId: msg.data.extId, extName, extVersion: version })
      })
      return subscription
    }
    const onExt: RawShell['onExt'] = (extId, cb) => {
      const match = matchMessage<CoreExt>()
      // FIXME: beware that immediate_deployment stays in memoruy this way - fix it
      const immediate_deployment = getExt(extId)
      if (immediate_deployment) {
        setImmediate(() => {
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
        cb(getExt(extId))
      })
      return subscription
    }

    const expose: RawShell['expose'] = expPnt => {
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
      // libOf,
      // onExtInstance,
      // onExtDeployment,
      getExt,
      onExt,
      pkgInfo,
      expose,
      lib: CoreLib,
      onExtInstalled,
      onExtUninstalled,
    }

    const shell: Shell = {
      onExtInstalled,
      onExtUninstalled,
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
      // plugin: _rawShell.onExtInstance,
      pkg(targetExtId) {
        return CoreLib.access(targetExtId, _rawShell)
      },
      deps: [],
      me: CoreLib.access<any>(extId, _rawShell),
      provide: CoreLib.provide(extId, _rawShell),
    }
    shell.deps = ext.requires.reduce<Shell['deps']>((_deps, depExtId) => {
      const depl = deployments.getByExtId(depExtId)
      assert(depl, `deployment not found for ${depExtId} requiresd by ${_rawShell.extId}`)
      return [
        ..._deps,
        {
          access: CoreLib.access(depExtId, _rawShell),
          plug: depl?.plug?.({ shell }),
        },
      ]
    }, [])

    return shell
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
      console.log(
        'PUSH ---\n',
        inspect(
          { bound, destExtId, path, data, parentMsgId: _opts?.parent?.id, _opts: { ..._opts, parent: undefined } },
          false,
          15,
          true,
        ),
        '\n--- PUSH\n',
      )
      const opts: PushOptions = {
        parent: null,
        primary: false,
        sub: false,
        ..._opts,
      }
      const pointer = joinPointer(destExtId, path)
      const destRegItem = deployments.assertDeployed(destExtId)
      if (opts.primary) {
        const { extName: pushToExtName } = splitExtId(destExtId)
        const expPnt = EXPOSED_POINTERS_REG[pushToExtName]?.[path]
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
      // deployments.assertDeployed(srcExtId) // assert me deployed

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
        meta: opts.meta,
      }

      setTimeout(() => $MAIN_MSGS$.next(msg), 10) //FIXME: 😱 why ?
      return msg as any
    }
  }

  function pkgEnv(pkgInstallationId: PkgInstallationId) {
    const pkgSys = main.readSysConfig().packages[pkgInstallationId]
    assert(pkgSys, `could not find pkgSys for ${pkgInstallationId}`)
    const mnDeplClass = process.env.MN_DEPL_CLASS ?? 'default'
    const env = pkgSys.env[mnDeplClass]
    return env
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
    const sysPackages = main.readSysConfig().packages
    const pkgsToInstall = Object.entries(sysPackages)
      .filter(([pkgInstallationId]) => !allPackagesIds.includes(pkgInstallationId))
      .map(([pkgInstallationId, sysInstalledPkg]) => ({ pkgInstallationId, sysInstalledPkg }))

    await Promise.all(
      pkgsToInstall.map(({ pkgInstallationId, sysInstalledPkg }) =>
        main.pkgMng.install(sysInstalledPkg.installPkgReq, pkgInstallationId),
      ),
    )
  }

  async function startup_deployAll() {
    // !FIXME: sort by dep-graph
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
    await startPkgs
      .map(_ => () => deployExtension({ pkgInstallationId: _.pkgInfo.id, install: __FIRST_RUN__ }))
      .reduce((_, curr) => () => _().then(() => curr()))()

    return
  }
}
export default boot

function newMsgId() {
  return Math.random().toString(36).substring(2)
}
