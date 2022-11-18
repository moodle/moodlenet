// @index(['webapp/**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as ExtensionsListStories from './webapp/components/organisms/ExtensionsList/ExtensionsList.stories.js'
export * as ExtensionsStories from './webapp/components/pages/Extensions/Extensions.stories.js'
export * as InstallExtensionStories from './webapp/components/pages/InstallExtension/InstallExtension.stories.js'
export * as ManageExtensionsStories from './webapp/components/pages/ManageExtensions/ManageExtensions.stories.js'
export * as ModulesStories from './webapp/Modules/Modules.stories.js'
// @endindex
