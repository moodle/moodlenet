import { enum as enum_z } from 'zod'
import { enabledContentCategories } from '../types'

export type contentCategoriesSchemas = ReturnType<typeof getContentCategoriesSchemas>

export type contentCategoriesSchemasDeps = {
  enabledContentCategories: enabledContentCategories
}

export function getContentCategoriesSchemas({ enabledContentCategories }: contentCategoriesSchemasDeps) {
  const language = enum_z(enabledContentCategories.languages.map(({ code }) => code) as [string, ...string[]])

  const license = enum_z(enabledContentCategories.licenses.map(({ code }) => code) as [string, ...string[]])
  return {
    language,
    license,
  }
}
