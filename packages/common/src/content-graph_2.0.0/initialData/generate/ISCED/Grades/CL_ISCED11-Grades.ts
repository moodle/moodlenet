// https://ec.europa.eu/eurostat/ramon/nomenclatures/index.cfm?TargetUrl=LST_NOM_DTL&StrNom=CL_ISCED11

type Basic_ISCED_Grade = { code: string; desc: string }
export const grades = _csv().filter(field => field.code === 'ADT' || field.code.match(/^ED\d{1,3}$/))

export default grades

function _csv(): Basic_ISCED_Grade[] {
  return [
    { code: `ISCED11`, desc: `International Standard Classification of Education (ISCED 2011)` },
    { code: `TOTAL`, desc: `All ISCED 2011 levels` },
    {
      code: `ED0-4`,
      desc: `Less than primary, primary, secondary and post-secondary non-tertiary education (levels 0-4)`,
    },
    { code: `ED0-2`, desc: `Less than primary, primary and lower secondary education (levels 0-2)` },
    { code: `ED0`, desc: `Early childhood education` },
    { code: `ED01`, desc: `Early childhood educational development` },
    { code: `ED02-8`, desc: `All ISCED 2011 levels excluding early childhood educational development` },
    { code: `ED02`, desc: `Pre-primary education` },
    {
      code: `ED1-4`,
      desc: `Primary, lower secondary, upper secondary and post-secondary non-tertiary education (levels 1-4)`,
    },
    { code: `ED1-3`, desc: `Primary and secondary education (levels 1-3)` },
    { code: `ED1_2`, desc: `Primary and lower secondary education (levels 1 and 2)` },
    { code: `ED1`, desc: `Primary education` },
    { code: `ED2-4`, desc: `Lower secondary, upper secondary and post-secondary non-tertiary education (levels 2-4)` },
    { code: `ED2_3`, desc: `Secondary education (levels 2 and 3)` },
    { code: `ED2`, desc: `Lower secondary education` },
    { code: `ED24`, desc: `Lower secondary education - general` },
    {
      code: `ED25_35_45`,
      desc: `Lower secondary, upper secondary and post-secondary non-tertiary education - vocational (levels 25, 35 and 45)`,
    },
    { code: `ED25`, desc: `Lower secondary education - vocational` },
    { code: `ED3-8`, desc: `Upper secondary, post-secondary non-tertiary and tertiary education (levels 3-8)` },
    { code: `ED3_4`, desc: `Upper secondary and post-secondary non-tertiary education (levels 3 and 4)` },
    { code: `ED3_4GEN`, desc: `Upper secondary and post-secondary non-tertiary education (levels 3 and 4) - general` },
    {
      code: `ED3_4VOC`,
      desc: `Upper secondary and post-secondary non-tertiary education (levels 3 and 4) - vocational`,
    },
    {
      code: `ED3_4UNK`,
      desc: `Upper secondary and post-secondary non-tertiary education (levels 3 and 4) - orientation unknown`,
    },
    { code: `ED3`, desc: `Upper secondary education` },
    { code: `ED3SW`, desc: `Upper secondary education - school and work-based vocational programmes` },
    { code: `ED34_44`, desc: `Upper secondary and post-secondary non-tertiary education - general (levels 34 and 44)` },
    { code: `ED34`, desc: `Upper secondary education - general` },
    {
      code: `ED341`,
      desc: `Upper secondary education - general, insufficient for level completion or partial level completion, without direct access to tertiary education`,
    },
    {
      code: `ED342_352`,
      desc: `Upper secondary education - all programmes, sufficient for partial level completion, without direct access to tertiary education (levels 342 and 352)`,
    },
    {
      code: `ED342`,
      desc: `Upper secondary education - general, sufficient for partial level completion, without direct access to tertiary education`,
    },
    {
      code: `ED343_353`,
      desc: `Upper secondary education - all programmes, sufficient for level completion, without direct access to tertiary education (levels 343 and 353)`,
    },
    {
      code: `ED343`,
      desc: `Upper secondary education - general, sufficient for level completion, without direct access to tertiary education`,
    },
    {
      code: `ED344_354`,
      desc: `Upper secondary education - all programmes, sufficient for level completion, with direct access to tertiary education (levels 344 and 354)`,
    },
    {
      code: `ED344`,
      desc: `Upper secondary education - general, sufficient for level completion, with direct access to tertiary education`,
    },
    {
      code: `ED35_45`,
      desc: `Upper secondary and post-secondary non-tertiary education - vocational (levels 35 and 45)`,
    },
    { code: `ED35`, desc: `Upper secondary education - vocational` },
    {
      code: `ED351`,
      desc: `Upper secondary education - vocational, insufficient for level completion or partial level completion, without direct access to tertiary education`,
    },
    {
      code: `ED352`,
      desc: `Upper secondary education - vocational, sufficient for partial level completion, without direct access to tertiary education`,
    },
    {
      code: `ED353`,
      desc: `Upper secondary education - vocational, sufficient for level completion, without direct access to tertiary education`,
    },
    {
      code: `ED354`,
      desc: `Upper secondary education - vocational, sufficient for level completion, with direct access to tertiary education`,
    },
    { code: `ED4`, desc: `Post-secondary non-tertiary education` },
    { code: `ED4SW`, desc: `Post-secondary non-tertiary education - school and work-based vocational programmes` },
    { code: `ED44`, desc: `Post-secondary non-tertiary education - general` },
    {
      code: `ED441`,
      desc: `Post-secondary non-tertiary education - general, insufficient for level completion, without direct access to tertiary education`,
    },
    {
      code: `ED443_453`,
      desc: `Post-secondary non-tertiary education - all programmes, sufficient for level completion, without direct access to tertiary education (levels 443 and 453)`,
    },
    {
      code: `ED443`,
      desc: `Post-secondary non-tertiary education - general, sufficient for level completion, without direct access to tertiary education`,
    },
    {
      code: `ED444_454`,
      desc: `Post-secondary non-tertiary education - all programmes, sufficient for level completion, with direct access to tertiary education (levels 444 and 454)`,
    },
    {
      code: `ED444`,
      desc: `Post-secondary non-tertiary education - general, sufficient for level completion, with direct access to tertiary education`,
    },
    { code: `ED45`, desc: `Post-secondary non-tertiary education - vocational` },
    {
      code: `ED451`,
      desc: `Post-secondary non-tertiary education - vocational, insufficient for level completion, without direct access to tertiary education`,
    },
    {
      code: `ED453`,
      desc: `Post-secondary non-tertiary education - vocational, sufficient for level completion, without direct access to tertiary education`,
    },
    {
      code: `ED454`,
      desc: `Post-secondary non-tertiary education - vocational, sufficient for level completion, with direct access to tertiary education`,
    },
    { code: `ED5-8`, desc: `Tertiary education (levels 5-8)` },
    { code: `ED5-7`, desc: `Tertiary education excluding doctoral or equivalent (levels 5-7)` },
    { code: `ED5_6`, desc: `Tertiary education and Bachelor's or equivalent (levels 5 and 6)` },
    { code: `ED5`, desc: `Tertiary education` },
    { code: `ED5SW`, desc: `Tertiary education - school and work-based vocational programmes` },
    { code: `ED54`, desc: `Tertiary education - general/academic` },
    { code: `ED541`, desc: `Tertiary education - general/academic, insufficient for level completion` },
    { code: `ED544`, desc: `Tertiary education - general/academic, sufficient for level completion` },
    { code: `ED55`, desc: `Tertiary education - vocational/professional` },
    {
      code: `ED551`,
      desc: `Tertiary education - vocational/professional, insufficient for level completion`,
    },
    {
      code: `ED554`,
      desc: `Tertiary education - vocational/professional, sufficient for level completion`,
    },
    { code: `ED6-8`, desc: `Tertiary education excluding tertiary education (levels 6-8)` },
    { code: `ED6`, desc: `Bachelor’s or equivalent` },
    { code: `ED64`, desc: `Bachelor's or equivalent - academic` },
    {
      code: `ED641_651_661`,
      desc: `Bachelors's or equivalent – all programmes, insufficient for level completion (levels 641, 651 and 661)`,
    },
    { code: `ED641`, desc: `Bachelor's or equivalent - academic, insufficient for level completion` },
    {
      code: `ED645_655_665`,
      desc: `Bachelors's or equivalent – all programmes, first degree (3-4 years) (levels 645, 655 and 665)`,
    },
    { code: `ED645`, desc: `Bachelor's or equivalent - academic, first degree (3-4 years)` },
    {
      code: `ED646_656_666`,
      desc: `Bachelors's or equivalent – all programmes, long first degree (more than 4 years) (levels 646, 656 and 666)`,
    },
    { code: `ED646`, desc: `Bachelor's or equivalent - academic, long first degree (more than 4 years)` },
    {
      code: `ED647_657_667`,
      desc: `Bachelors's or equivalent – all programmes, second or further degree (following a Bachelor's or equivalent programme) (levels 647, 657 and 667)`,
    },
    {
      code: `ED647`,
      desc: `Bachelor's or equivalent - academic, second or further degree (following a Bachelor's or equivalent programme)`,
    },
    { code: `ED65`, desc: `Bachelor's or equivalent - professional` },
    { code: `ED651`, desc: `Bachelor's or equivalent - professional, insufficient for level completion` },
    { code: `ED655`, desc: `Bachelor's or equivalent - professional, first degree (3-4 years)` },
    { code: `ED656`, desc: `Bachelor's or equivalent - professional, long first degree (more than 4 years)` },
    {
      code: `ED657`,
      desc: `Bachelor's or equivalent - professional, second or further degree (following a Bachelor's or equivalent programme)`,
    },
    { code: `ED66`, desc: `Bachelor's or equivalent - orientation unspecified` },
    {
      code: `ED661`,
      desc: `Bachelor's or equivalent - orientation unspecified, insufficient for level completion`,
    },
    { code: `ED665`, desc: `Bachelor's or equivalent - orientation unspecified, first degree (3-4 years)` },
    {
      code: `ED666`,
      desc: `Bachelor's or equivalent - orientation unspecified, long first degree (more than 4 years)`,
    },
    {
      code: `ED667`,
      desc: `Bachelor's or equivalent - orientation unspecified, second or further degree (following a Bachelor's or equivalent programme)`,
    },
    { code: `ED7_8`, desc: `Master's and Doctoral or equivalent (levels 7 and 8)` },
    { code: `ED7`, desc: `Master’s or equivalent` },
    { code: `ED74`, desc: `Master's or equivalent - academic` },
    {
      code: `ED741_751_761`,
      desc: `Master's or equivalent – all programmes, insufficient for level completion (levels 741, 751 and 761)`,
    },
    { code: `ED741`, desc: `Master's or equivalent - academic, insufficient for level completion` },
    {
      code: `ED746_756_766`,
      desc: `Master's or equivalent – all programmes, long first degree (at least 5 years) (levels 746, 756 and 766)`,
    },
    { code: `ED746`, desc: `Master's or equivalent - academic, long first degree (at least 5 years)` },
    {
      code: `ED747_757_767`,
      desc: `Master's or equivalent – all programmes, second or further degree (following a Bachelor's or equivalent programme) (levels 747, 757 and 767)`,
    },
    {
      code: `ED747`,
      desc: `Master's or equivalent - academic, second or further degree (following a Bachelor's or equivalent programme)`,
    },
    {
      code: `ED748_758_768`,
      desc: `Master's or equivalent – all programmes, second or further degree (following a Master's or equivalent programme) (levels 748, 758 and 768)`,
    },
    {
      code: `ED748`,
      desc: `Master's or equivalent - academic, second or further degree (following a Master's or equivalent programme)`,
    },
    { code: `ED75`, desc: `Master's or equivalent - professional` },
    { code: `ED751`, desc: `Master's or equivalent - professional, insufficient for level completion` },
    { code: `ED756`, desc: `Master's or equivalent - professional, long first degree (at least 5 years)` },
    {
      code: `ED757`,
      desc: `Master's or equivalent - professional, second or further degree (following a Bachelor's or equivalent programme)`,
    },
    {
      code: `ED758`,
      desc: `Master's or equivalent - professional, second or further degree (following a Master's or equivalent programme)`,
    },
    { code: `ED76`, desc: `Master's or equivalent - orientation unspecified` },
    {
      code: `ED761`,
      desc: `Master's or equivalent - orientation unspecified, insufficient for level completion`,
    },
    {
      code: `ED766`,
      desc: `Master's or equivalent - orientation unspecified, long first degree (at least 5 years)`,
    },
    {
      code: `ED767`,
      desc: `Master's or equivalent - orientation unspecified, second or further degree (following a Bachelor's or equivalent programme)`,
    },
    {
      code: `ED768`,
      desc: `Master's or equivalent - orientation unspecified, second or further degree (following a Master's or equivalent programme)`,
    },
    { code: `ED8`, desc: `Doctoral or equivalent` },
    { code: `ADT`, desc: `Adult Education` },
  ]
}
