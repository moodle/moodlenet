import { DepGraph /* , DepGraphCycleError */ } from 'dependency-graph'
import type { DepGraphData, Ext, ExtDef } from '../types'

// export function checkDepGraph(dg: DepGraph<DepGraphData>): CheckDepGraphRes {
//   try {
//     const cycleCheck = checkCycle(dg)
//     if (cycleCheck.type !== 'acyclic') {
//       return cycleCheck
//     }
//     const unmatchedDepVersions = cycleCheck.overallOrder
//       .map(extName => {
//         const { ext } = dg.getNodeData(extName)
//         const unmatchedDeps = ext.requires.filter(reqExtId => {
//           const reqExtIdSplit = splitExtId(reqExtId)
//           const { version: foundVersion } = dg.getNodeData(reqExtIdSplit.extName)
//           return !isVerBWC(foundVersion, reqExtIdSplit.version)
//         })
//         return { ext, unmatchedDeps }
//       })
//       .filter(({ unmatchedDeps }) => unmatchedDeps.length)
//     if (unmatchedDepVersions.length) {
//       return { type: 'unmatched-dep-version', unmatches: unmatchedDepVersions }
//     }
//     const overallOrder = cycleCheck.overallOrder.map(extName => dg.getNodeData(extName).ext)
//     return { type: 'pass', overallOrder }
//   } catch (e) {
//     return { type: 'unknown-error', message: String(e) }
//   }
// }
// export function depGraphMod(dg: DepGraph<DepGraphData>, rms: Ext[], adds: Ext[]) {
//   depGraphRm(dg, rms, adds)
//   depGraphAddNodes(dg, adds)
//   depGraphAddDeps(dg, adds)
// }
export function depGraphAddNodes<Def extends ExtDef>(dg: DepGraph<DepGraphData>, adds: Ext<Def>[]) {
  adds.forEach(ext => {
    if (dg.hasNode(ext.name)) {
      throw new Error(`depGraphAdd: found duplicated [${ext.name}]`)
    }
    dg.addNode(ext.name, { version: ext.version, ext: ext as any })
  })
}
// export function depGraphAddDeps(dg: DepGraph<DepGraphData>, adds: Ext[]) {
//   adds.forEach(ext => {
//     const { extName } = splitExtId(ext.id)
//     ext.requires.forEach(dep => {
//       const depSplit = splitExtId(dep)
//       dg.addDependency(extName, depSplit.extName)
//     })
//   })
// }
// //FIXME: depGraphRm
// //TODO: when removing a node should cascade remove all dependants, if the removing node is not going to be readded ( notice version check is performed later! )
export function depGraphRm(dg: DepGraph<DepGraphData>, rms: Ext[], willAdd: Ext[]) {
  rms.forEach(ext => {
    const shouldCascadeRemoveDependants = !willAdd.find(({ name }) => name === ext.name)
    shouldCascadeRemoveDependants
    dg.removeNode(ext.name)
  })
}

// export function checkCycle(dg: DepGraph<any>): CheckCycleRes {
//   try {
//     const overallOrder = dg.overallOrder()
//     return { type: 'acyclic', overallOrder }
//   } catch (e) {
//     if (e instanceof DepGraphCycleError) {
//       return { type: 'cyclic', cycle: e.cyclePath, message: e.message }
//     }
//     return { type: 'unknown-error', message: String(e) }
//   }
// }
