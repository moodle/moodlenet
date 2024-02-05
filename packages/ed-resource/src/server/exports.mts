export { canPublish } from './aql.mjs'
export { EdResourceEntitiesTools } from './entities.mjs'
export { publicFiles } from './init/fs.mjs'
export { Resource } from './init/sys-entities.mjs'
export { getImageAssetInfo } from './lib.mjs'
export {
  // createResource,
  // deleteImageFile,
  // delResource,
  // delResourceFile,
  deltaResourcePopularityItem,
  EMPTY_RESOURCE,
  getImageLogicalFilename,
  getResource,
  getResourceFile,
  getResourceFileUrl,
  getValidations,
  // patchResource,
  // storeResourceFile,
  updateImage as silentlyUpdateImage,
  validationsConfigs,
} from './services.mjs'
export * from './types.mjs'
export * from './xsm/exports.mjs'
export { stdEdResourceMachine } from './xsm/machines.mjs'
import { shell } from './shell.mjs'
export const on = shell.events.on
