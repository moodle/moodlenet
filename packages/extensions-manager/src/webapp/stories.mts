// @index(['webapp/**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as ExtensionsListStories from './components/organisms/ExtensionsList/ExtensionsList.stories.js'
export * as ExtensionsStories from './components/pages/Extensions/Extensions.stories.js'
export * as InstallExtensionStories from './components/pages/InstallExtension/InstallExtension.stories.js'
export * as ManageExtensionsStories from './components/pages/ManageExtensions/ManageExtensions.stories.js'
export * as ModulesStories from './Modules/Modules.stories.js'
// @endindex
