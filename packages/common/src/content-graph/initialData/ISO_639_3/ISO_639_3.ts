import { contentSlug } from '../../../utils/content-graph/slug-id'
import { Language } from '../../types/node'
import iso_data_arr from './ISO_639_3_tab-DATA'

export const getIso639_3 = () =>
  iso_data_arr.map(iso_data => {
    const language: Language = {
      _type: 'Language',
      _permId: iso_data.id,
      _slug: contentSlug({ name: iso_data.name, slugCode: iso_data.id }),
      name: iso_data.name,
      description: iso_data.name,
      part1: iso_data.part1,
      part2b: iso_data.part2b,
      part2t: iso_data.part2t,
      scope: iso_data.scope,
      langType: iso_data.type,
    }

    return language
  })
