// @index(['./**/*.tsx'], f => `export * as ${f.name} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as Settings from './AdminSettings.js'
export * as FormConfig from './FormConfig.js'
export * as ListConfig from './ListConfig.js'
export * as Login from './Login.js'
export * as LoginFail from './LoginFail.js'
export * as LoginSuccess from './LoginSuccess.js'
export * as MainModule from './MainModule.js'
export * as routes from './routes.js'
// @endindex
