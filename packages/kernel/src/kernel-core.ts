import { DepGraph } from 'dependency-graph'
import { mergeMap, of, share, Subject } from 'rxjs'
import { depGraphAddNodes } from './dep-graph'
import * as K from './k'
import { matchMessage } from './k/message'
import { isExtIdBWC, joinPointer, splitExtId } from './k/pointer'
import { pkgDiskInfoOf } from './npm-pkg'
import { createLocalDeploymentRegistry } from './registry/node'
import type {
  DataMessage,
  DepGraphData,
  Deploy,
  DeploymentShell,
  ExposedPointerMap,
  ExposePointers,
  Ext,
  ExtDef,
  ExtId,
  ExtName,
  KernelExt,
  MessagePush,
  MWFn,
  PkgDiskInfo,
  PushMessage,
  PushOptions,
  RawExtEnv,
  RegDeployment,
  Shell,
} from './types'

export type CreateCfg = { extEnvVars: Record<ExtName, RawExtEnv> }

// export const kernelPkgInfo: PkgInfo = { name: 'moodlenet.kernel', version: '0.1.10' }
export const kernelExtId: ExtId<KernelExt> = 'kernel.core@0.1.10'

// type Env = {
// }
// function getEnv(rawExtEnv: RawExtEnv): Env {
//   return rawExtEnv as any //implement checks
// }

export const create = ({ extEnvVars }: CreateCfg) => {
  const EXPOSED_POINTERS_REG: Record<ExtName, ExposedPointerMap> = {}
  // const _env = getEnv(global_env['kernel.core'])

  const deplReg = createLocalDeploymentRegistry()
  const depGraph = new DepGraph<DepGraphData>()
  const $MAIN_MSGS$ = new Subject<DataMessage<any>>()
  const pipedMessages$ = $MAIN_MSGS$.pipe(
    // tap(msg => console.log('++++++msg', msg)),
    mergeMap(msg => {
      const orderDepl = depOrderDeployments()
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
    enable: (/* shell */) => {
      return {
        mw: msg => of(msg),
        deploy(
          {
            /* , tearDown  */
          },
        ) {
          return {}
        },
      }
    },
  }
  depGraphAddNodes(depGraph, [kernelExt])
  const pkgDiskInfo = pkgDiskInfoOf(__filename)
  const KDeployment = deployExtension<KernelExt>({ ext: kernelExt, pkgDiskInfo })

  return {
    deployExtension,
    undeployExtension,
    depOrderDeployments,
    extEnv,
    global_env: extEnvVars,
    deplReg,
    depGraph,
    $MAIN_MSGS$,
    pipedMessages$,
    KDeployment,
  }

  async function deployExtension<Def extends ExtDef>({
    ext,
    pkgDiskInfo,
    deployWith,
  }: {
    ext: Ext<Def>
    pkgDiskInfo: PkgDiskInfo
    deployWith?: Deploy<Def>
  }) {
    const extId = ext.id
    const extIdSplit = splitExtId(extId)
    const env = extEnv(extId)
    const $msg$ = new Subject<DataMessage<any>>()

    const push = pushMsg<Def>(extId)
    const getExt: Shell['getExt'] = deplReg.get as any

    const onExt: Shell['onExt'] = (extId, cb) => {
      const match = matchMessage<KernelExt>()
      // console.log('onExt', extId)
      const subscription = pipedMessages$.subscribe(msg => {
        // console.log('onExt', msg)

        if (
          !(
            (match(msg, 'kernel.core@0.1.10::ext/deployed') || match(msg, 'kernel.core@0.1.10::ext/undeployed')) &&
            isExtIdBWC(msg.data.extId, extId)
          )
        ) {
          return
        }

        cb(getExt(extId))
      })
      return subscription
    }

    const onExtInstance: Shell['onExtInstance'] = (extId, cb) => {
      let cleanup: void | (() => void) = undefined
      const subscription = onExt(extId, regDeployment => {
        // console.log('onExtInstance', extId, `[${regDeployment?.extId}]`)
        if (!regDeployment?.inst) {
          return cleanup?.()
        }
        cleanup = cb(regDeployment.inst?.({ depl: depl as any }) /* , regDeployment as any */)
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

    const libOf: Shell['libOf'] = id => {
      return deplReg.get(id)?.lib?.({ depl: depl as any })
    }

    const expose: ExposePointers = expPnt => {
      console.log(`Expose `, extIdSplit.extName, expPnt)
      EXPOSED_POINTERS_REG[extIdSplit.extName] = expPnt
    }

    const shell: Shell<Def> = {
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
      lib: K,
    }

    const tearDown = pipedMessages$.subscribe($msg$)

    const deploymentShell: DeploymentShell = {
      tearDown,
    }

    const extDeployable = ext.enable(shell)

    const deployer = deployWith ?? extDeployable.deploy

    const extDeployment = await deployer(deploymentShell, shell)

    const depl: RegDeployment<Def> = {
      ...{ deployedWith: deployWith, at: new Date(), ext, $msg$, pkgInfo: pkgDiskInfo },
      ...deploymentShell,
      ...shell,
      ...extDeployment,
      ...extDeployable,
    }

    setImmediate(() => {
      /* const msg = */ pushMsg<KernelExt>('kernel.core@0.1.10')('out')<KernelExt>('kernel.core@0.1.10')(
        'ext/deployed',
      )({
        extId,
      })
      // console.log('ext/deployed msg', msg)
    })

    deplReg.deploy<Def>({ depl })
    return depl
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

  function undeployExtension(extName: ExtName) {
    const wasDeployment = deplReg.undeploy(extName)
    wasDeployment?.$msg$.complete()
    wasDeployment?.tearDown.unsubscribe()
    return wasDeployment
  }

  function depOrderDeployments() {
    return depGraph
      .overallOrder()
      .reverse()
      .map(pushToExtName => {
        const deployment = deplReg.getByName(`${pushToExtName}@*`)
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
