// @index(['webapp/**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as ExtensionsStories from './webapp/Extensions.stories.js'
export * as InstallExtensionStories from './webapp/InstallExtension/InstallExtension.stories.js'
export * as ModulesStories from './webapp/Modules/Modules.stories.js'
export * as PackagesStories from './webapp/Packages/Packages.stories.js'
// @endindex
