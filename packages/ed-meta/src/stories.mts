// @index(['./**/*.stories.tsx'], f => `export * as ${f.name.replace('.stories','Stories')} from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * as LicenseFieldStories from './webapp/components/molecules/LicenseField/LicenseField.stories.js'
export * as SubjectFieldStories from './webapp/components/molecules/SubjectField/SubjectField.stories.js'
// @endindex
