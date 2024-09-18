// @index(['../components/**/*.stories.*'], f => `export * as ${f.name.replace('.stories','Stories').replace('.props','')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as ExtensionsListStories from '../components/organisms/ExtensionsList/ExtensionsList.stories'
export * as ExtensionsStories from '../components/pages/Extensions/Extensions.stories'
export * as InstallExtensionStories from '../components/pages/InstallExtension/InstallExtension.stories'
export * as ManageExtensionsStories from '../components/pages/ManageExtensions/ManageExtensions.stories'
// @endindex
