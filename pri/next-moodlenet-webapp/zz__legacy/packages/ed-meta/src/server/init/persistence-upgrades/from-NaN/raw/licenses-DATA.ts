type Basic_License = { code: string; description: string; published: boolean }

export default _licenses()
function _licenses(): Basic_License[] {
  return [
    { code: 'cc-0', description: 'Public domain', published: true },
    { code: 'cc-by', description: 'Attribution', published: true },
    { code: 'cc-by-sa', description: 'Attribution + ShareAlike', published: true },
    { code: 'cc-by-nc', description: 'Attribution + NonCommercial', published: true },
    {
      code: 'cc-by-nc-sa',
      description: 'Attribution + NonCommercial + ShareAlike',
      published: true,
    },
    // NOTE: The 'cc-by-nd' record was from the initial setupo (v NaN) and was corrected on DB v5 (apr 2024) to the one below,
    // { code: 'cc-by-nd', description: 'Attribution NonCommercial', published: true },
    // modified 'cc-by-nd' record anyway to keep correct record base here as it won't conflict with any existing data.
    { code: 'cc-by-nd', description: 'Attribution + NoDerivatives', published: true },
    {
      code: 'cc-by-nc-nd',
      description: 'Attribution + NonCommercial + NoDerivatives',
      published: true,
    },
    { code: 'other-open', description: 'Other open license', published: false },
    { code: 'restricted-copyright', description: 'Restricted / copyrighted', published: false },
  ]
}
