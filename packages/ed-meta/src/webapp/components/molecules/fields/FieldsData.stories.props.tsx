import type { IconTextOptionProps, TextOptionProps } from '@moodlenet/component-library'
import { getYearList, LicenseNodes } from '@moodlenet/component-library'

export const TypeTextOptionProps: TextOptionProps[] = [
  {
    value: '0',
    label: 'Assessment',
  },
  {
    value: '1',
    label: 'Concept map',
  },
  {
    value: '2',
    label: 'Course',
  },
  {
    value: '3',
    label: 'Curriculum',
  },
  {
    value: '4',
    label: 'Data set',
  },
  {
    value: '5',
    label: 'Experiment',
  },
  {
    value: '6',
    label: 'Game',
  },
  {
    value: '7',
    label: 'Glossary',
  },
  {
    value: '8',
    label: 'Graph',
  },
  {
    value: '9',
    label: 'Guides and Tutorials',
  },
  {
    value: '10',
    label: 'Interactive learning object',
  },
  {
    value: '11',
    label: 'Map',
  },
  {
    value: '12',
    label: 'Online courses site',
  },
  {
    value: '13',
    label: 'Project',
  },
  {
    value: '14',
    label: 'Questionnaire',
  },
  {
    value: '15',
    label: 'Reading',
  },
  {
    value: '16',
    label: 'References',
  },
  {
    value: '17',
    label: 'Report',
  },
  {
    value: '18',
    label: 'Repository',
  },
  {
    value: '19',
    label: 'Simulation',
  },
  {
    value: '20',
    label: 'Unit of study',
  },
]

export const LicenseIconTextOptionProps: IconTextOptionProps[] = [
  {
    label: 'CC-0 (Public domain)',
    value: 'CC-0 (Public domain)',
    icon: LicenseNodes['0'],
  },
  {
    label: 'CC-BY (Attribution)',
    value: 'CC-BY (Attribution)',
    icon: LicenseNodes['by'],
  },
  {
    label: 'CC-BY-SA (Attribution-ShareAlike)',
    value: 'CC-BY-SA (Attribution-ShareAlike)',
    icon: LicenseNodes['by-sa'],
  },
  {
    label: 'CC-BY-NC (Attribution-NonCommercial)',
    value: 'CC-BY-NC (Attribution-NonCommercial)',
    icon: LicenseNodes['by-nc'],
  },
  {
    label: 'CC-BY-NC-SA (Attribution-NonCommercial-ShareAlike)',
    value: 'CC-BY-NC-SA (Attribution-NonCommercial-ShareAlike)',
    icon: LicenseNodes['by-nc-sa'],
  },
  {
    label: 'CC-BY-ND (Attribution-NoDerivatives)',
    value: 'CC-BY-ND (Attribution-NoDerivatives)',
    icon: LicenseNodes['by-nd'],
  },
  {
    label: 'CC-BY-NC-ND (Attribution-NonCommercial-NoDerivatives)',
    value: 'CC-BY-NC-ND (Attribution-NonCommercial-NoDerivatives)',
    icon: LicenseNodes['by-nc-nd'],
  },
]

export const SubjectsTextOptionProps: TextOptionProps[] = [
  {
    value: `0000`,
    label: `Generic programmes and qualifications not further defined`,
  },
  { value: `0011`, label: `Basic programmes and qualifications` },
  { value: `0021`, label: `Literacy and numeracy` },
  { value: `0031`, label: `Personal skills and development` },
  {
    value: `0099`,
    label: `Generic programmes and qualifications not elsewhere classified`,
  },
  { value: `0110`, label: `Education not further defined` },
  { value: `0111`, label: `Education science` },
  { value: `0112`, label: `Training for pre-school teachers` },
  { value: `0113`, label: `Teacher training without subject specialisation` },
  { value: `0114`, label: `Teacher training with subject specialisation` },
  { value: `0119`, label: `Education not elsewhere classified` },

  {
    value: `0188`,
    label: `Inter-disciplinary programmes and qualifications involvin{label:lue: education`,
  },
  { value: `0200`, label: `Arts and humanities not further defined` },
  { value: `0211`, label: `Audio-visual techniques and media production` },
  { value: `0212`, label: `Fashion, interior and industrial design` },
  { value: `0213`, label: `Fine arts` },
  { value: `0214`, label: `Handicrafts` },
  { value: `0215`, label: `Music and performing arts` },
  { value: `0219`, label: `Arts not elsewhere classified` },
  { value: `0220`, label: `Humanities (except languages) not further defined` },
  { value: `0221`, label: `Religion and theology` },
  { value: `0222`, label: `History and archaeology` },
  { value: `0223`, label: `Philosophy and ethics` },
  {
    value: `0229`,
    label: `Humanities (except languages) not elsewhere classified`,
  },
  { value: `0230`, label: `Languages not further defined` },
  { value: `0231`, label: `Language acquisition` },
  { value: `0232`, label: `Literature and linguistics` },
  { value: `0239`, label: `Languages not elsewhere classified` },

  {
    value: `0288`,
    label: `Inter-disciplinary programmes and qualifications involving arts an{label:lue: humanities`,
  },
  { value: `0299`, label: `Arts and humanities not elsewhere classified` },
  {
    value: `0300`,
    label: `Social sciences, journalism and information not further defined`,
  },
  {
    value: `0310`,
    label: `Social and behavioural sciences not further defined`,
  },
  { value: `0311`, label: `Economics` },
  { value: `0312`, label: `Political sciences and civics` },
  { value: `0313`, label: `Psychology` },
  { value: `0314`, label: `Sociology and cultural studies` },
  {
    value: `0319`,
    label: `Social and behavioural sciences not elsewhere classified`,
  },
  { value: `0320`, label: `Journalism and information not further defined` },
  { value: `0321`, label: `Journalism and reporting` },
  { value: `0322`, label: `Library, information and archival studies` },
  {
    value: `0329`,
    label: `Journalism and information not elsewhere classified`,
  },

  {
    value: `0388`,
    label: `Inter-disciplinary programmes and qualifications involving social sciences, journalism an{label:lue: information`,
  },

  {
    value: `0399`,
    label: `Social sciences, journalism and information not elsewher{label:lue: classified`,
  },
  {
    value: `0400`,
    label: `Business, administration and law not further defined`,
  },
  { value: `0410`, label: `Business and administration not further defined` },
  { value: `0411`, label: `Accounting and taxation` },
  { value: `0412`, label: `Finance, banking and insurance` },
  { value: `0413`, label: `Management and administration` },
  { value: `0414`, label: `Marketing and advertising` },
  { value: `0415`, label: `Secretarial and office work` },
  { value: `0416`, label: `Wholesale and retail sales` },
  { value: `0417`, label: `Work skills` },
  {
    value: `0419`,
    label: `Business and administration not elsewhere classified`,
  },
  { value: `0421`, label: `Law` },

  {
    value: `0488`,
    label: `Inter-disciplinary programmes and qualifications involving business, administration an{label:lue: law`,
  },
  {
    value: `0499`,
    label: `Business, administration and law not elsewhere classified`,
  },
  {
    value: `0500`,
    label: `Natural sciences, mathematics and statistics not further defined`,
  },
  {
    value: `0510`,
    label: `Biological and related sciences not further defined`,
  },
  { value: `0511`, label: `Biology` },
  { value: `0512`, label: `Biochemistry` },
  {
    value: `0519`,
    label: `Biological and related sciences not elsewhere classified`,
  },
  { value: `0520`, label: `Environment not further defined` },
  { value: `0521`, label: `Environmental sciences` },
  { value: `0522`, label: `Natural environments and wildlife` },
  { value: `0529`, label: `Environment not elsewhere classified` },
  { value: `0530`, label: `Physical sciences not further defined` },
  { value: `0531`, label: `Chemistry` },
  { value: `0532`, label: `Earth sciences` },
  { value: `0533`, label: `Physics` },
  { value: `0539`, label: `Physical sciences not elsewhere classified` },
  { value: `0540`, label: `Mathematics and statistics not further defined` },
  { value: `0541`, label: `Mathematics` },
  { value: `0542`, label: `Statistics` },

  {
    value: `0588`,
    label: `Inter-disciplinary programmes and qualifications involving natural sciences, mathematics an{label:lue: statistics`,
  },

  {
    value: `0599`,
    label: `Natural sciences, mathematics and statistics not elsewher{label:lue: classified`,
  },

  {
    value: `0610`,
    label: `Information and Communication Technologies (ICTs) not furthe{label:lue: defined`,
  },
  { value: `0611`, label: `Computer use` },
  { value: `0612`, label: `Database and network design and administration` },
  {
    value: `0613`,
    label: `Software and applications development and analysis`,
  },

  {
    value: `0619`,
    label: `Information and Communication Technologies (ICTs) not elsewher{label:lue: classified`,
  },

  {
    value: `0688`,
    label: `Inter-disciplinary programmes and qualifications involving Information and Communication Technologies (ICTs) Broad field Narrow field Detaile{label:lue: field`,
  },
  {
    value: `0700`,
    label: `Engineering, manufacturing and construction not further defined`,
  },
  {
    value: `0710`,
    label: `Engineering and engineering trades not further defined`,
  },
  { value: `0711`, label: `Chemical engineering and processes` },
  { value: `0712`, label: `Environmental protection technology` },
  { value: `0713`, label: `Electricity and energy` },
  { value: `0714`, label: `Electronics and automation` },
  { value: `0715`, label: `Mechanics and metal trades` },
  { value: `0716`, label: `Motor vehicles, ships and aircraft` },
  {
    value: `0719`,
    label: `Engineering and engineering trades not elsewhere classified`,
  },
  { value: `0720`, label: `Manufacturing and processing not further defined` },
  { value: `0721`, label: `Food processing` },
  { value: `0722`, label: `Materials (glass, paper, plastic and wood)` },
  { value: `0723`, label: `Textiles (clothes, footwear and leather)` },
  { value: `0724`, label: `Mining and extraction` },
  {
    value: `0729`,
    label: `Manufacturing and processing not elsewhere classified`,
  },
  { value: `0730`, label: `Architecture and construction not further defined` },
  { value: `0731`, label: `Architecture and town planning` },
  { value: `0732`, label: `Building and civil engineering` },

  {
    value: `0788`,
    label: `Inter-disciplinary programmes and qualifications involving engineering, manufacturing an{label:lue: construction`,
  },

  {
    value: `0799`,
    label: `Engineering, manufacturing and construction not elsewher{label:lue: classified`,
  },

  {
    value: `0800`,
    label: `Agriculture, forestry, fisheries and veterinary not furthe{label:lue: defined`,
  },
  { value: `0810`, label: `Agriculture not further defined` },
  { value: `0811`, label: `Crop and livestock production` },
  { value: `0812`, label: `Horticulture` },
  { value: `0819`, label: `Agriculture not elsewhere classified` },
  { value: `0821`, label: `Forestry` },
  { value: `0831`, label: `Fisheries` },
  { value: `0841`, label: `Veterinary` },

  {
    value: `0888`,
    label: `Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries an{label:lue: veterinary`,
  },

  {
    value: `0899`,
    label: `Agriculture, forestry, fisheries and veterinary not elsewher{label:lue: classified`,
  },
  { value: `0900`, label: `Health and welfare not further defined` },
  { value: `0910`, label: `Health not further defined` },
  { value: `0911`, label: `Dental studies` },
  { value: `0912`, label: `Medicine` },
  { value: `0913`, label: `Nursing and midwifery` },
  { value: `0914`, label: `Medical diagnostic and treatment technology` },
  { value: `0915`, label: `Therapy and rehabilitation` },
  { value: `0916`, label: `Pharmacy` },
  {
    value: `0917`,
    label: `Traditional and complementary medicine and therapy`,
  },
  { value: `0919`, label: `Health not elsewhere classified` },
  { value: `0920`, label: `Welfare not further defined` },
  { value: `0921`, label: `Care of the elderly and of disabled adults` },
  { value: `0922`, label: `Child care and youth services` },
  { value: `0923`, label: `Social work and counselling` },
  { value: `0929`, label: `Welfare not elsewhere classified` },

  {
    value: `0988`,
    label: `Inter-disciplinary programmes and qualifications involving health an{label:lue: welfare`,
  },
  { value: `0999`, label: `Health and welfare not elsewhere classified` },
  { value: `1000`, label: `Services not further defined` },
  { value: `1010`, label: `Personal services not further defined` },
  { value: `1011`, label: `Domestic services` },
  { value: `1012`, label: `Hair and beauty services` },
  { value: `1013`, label: `Hotel, restaurants and catering` },
  { value: `1014`, label: `Sports` },
  { value: `1015`, label: `Travel, tourism and leisure` },
  { value: `1019`, label: `Personal services not elsewhere classified` },
  {
    value: `1020`,
    label: `Hygiene and occupational health services not further defined`,
  },
  { value: `1021`, label: `Community sanitation` },
  { value: `1022`, label: `Occupational health and safety` },
  {
    value: `1029`,
    label: `Hygiene and occupational health services not elsewhere classified`,
  },
  { value: `1030`, label: `Security services not further defined` },
  { value: `1031`, label: `Military and defence` },
  { value: `1032`, label: `Protection of persons and property` },
  { value: `1039`, label: `Security services not elsewhere classified` },
  { value: `1041`, label: `Transport services` },

  {
    value: `1088`,
    label: `Inter-disciplinary programmes and qualifications involvin{label:lue: services`,
  },
  { value: `1099`, label: `Services not elsewhere classified` },
  { value: `9999`, label: `Field unknown` },
]

export const MonthTextOptionProps: TextOptionProps[] = [
  { value: `0`, label: `January` },
  { value: `1`, label: `February` },
  { value: `2`, label: `March` },
  { value: `3`, label: `April` },
  { value: `4`, label: `May` },
  { value: `5`, label: `June` },
  { value: `6`, label: `July` },
  { value: `7`, label: `August` },
  { value: `8`, label: `September` },
  { value: `9`, label: `October` },
  { value: `10`, label: `November` },
  { value: `11`, label: `December` },
]
export const YearsProps: string[] = getYearList(1750)

export const LevelTextOptionProps: TextOptionProps[] = [
  { value: '0.1', label: `Early childhood educational development` },
  { value: '0.2', label: `Pre-primary education` },
  { value: '1', label: `Primary education` },
  { value: '2', label: `Lower secondary education` },
  { value: '3', label: `Upper secondary education` },
  { value: '4', label: `Post-secondary non-tertiary education` },
  { value: '5', label: `Short-cycle tertiary education` },
  { value: '6', label: `Bachelor or equivalent` },
  { value: '7', label: `Master or equivalent` },
  { value: '8', label: `Doctoral or equivalent` },
]

export const LanguagesTextOptionProps: TextOptionProps[] = [
  { value: 'English', label: `English` },
  { value: 'Italian', label: `Italian` },
  { value: 'Greek', label: `Greek` },
  { value: 'German', label: `German` },
  { value: 'French', label: `French` },
  { value: 'Spanish', label: `Spanish` },
  { value: 'Portuguese', label: `Portuguese` },
  { value: 'Russian', label: `Russian` },
  { value: 'Chinese', label: `Chinese` },
  { value: 'Japanese', label: `Japanese` },
  { value: 'Arabic', label: `Arabic` },
  { value: 'Hindi', label: `Hindi` },
  { value: 'Bengali', label: `Bengali` },
  { value: 'Punjabi', label: `Punjabi` },
  { value: 'Urdu', label: `Urdu` },
  { value: 'Persian', label: `Persian` },
  { value: 'Turkish', label: `Turkish` },
  { value: 'Korean', label: `Korean` },
  { value: 'Vietnamese', label: `Vietnamese` },
  { value: 'Thai', label: `Thai` },
  { value: 'Indonesian', label: `Indonesian` },
  { value: 'Malay', label: `Malay` },
]
