import { url_string_schema } from '@moodle/lib-types'

export const iscedWebsite = url_string_schema.parse(
  'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=International_Standard_Classification_of_Education_(ISCED)',
)
