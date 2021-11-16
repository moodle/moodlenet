type Basic_License = { code: string; desc: string; pub: boolean }

export default _licenses()
function _licenses(): Basic_License[] {
  return [
    { code: 'cc-0', desc: 'Public domain', pub: true },
    { code: 'cc-by', desc: 'Attribution', pub: true },
    { code: 'cc-by-sa', desc: 'Attribution + ShareAlike', pub: true },
    { code: 'cc-by-nc', desc: 'Attribution + NonCommercial', pub: true },
    { code: 'cc-by-nc-sa', desc: 'Attribution + NonCommercial + ShareAlike', pub: true },
    { code: 'cc-by-nd', desc: 'Attribution NonCommercial', pub: true },
    { code: 'cc-by-nc-nd', desc: 'Attribution + NonCommercial + NoDerivatives', pub: true },
    { code: 'other-open', desc: 'Other open license', pub: false },
    { code: 'restricted-copyright', desc: 'Restricted / copyrighted', pub: false },
  ]
}
