// @index(['./**/*.tsx'], f => `export * as ${f.name} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as ConfirmEmail from './ConfirmEmail.js'
export * as Login from './Login/LoginComponent.js'
export * as LoginCtrl from './Login/LoginCtrl.js'
export * as MainComponent from './MainComponent.js'
export * as Router from './Router.js'
export * as Settings from './Settings.js'
export * as Signup from './Signup.js'
// @endindex
