import { t } from "@lingui/macro"
import { DropdownOptionsType } from "../../components/atoms/Dropdown/Dropdown"
import byIcon from '../../static/icons/license/by.svg'
import ncIcon from '../../static/icons/license/nc.svg'
import ndIcon from '../../static/icons/license/nd.svg'
import saIcon from '../../static/icons/license/sa.svg'
import zeroIcon from '../../static/icons/license/zero.svg'

export type DropdownField = {
    label?: string
    options: DropdownOptionsType 
    placeholder?: string
}

export const LevelDropdown: DropdownField  =  {
    label: t`Level`,
    options:  [
        t`0.1 Early childhood educational development`,
        t`0.2 Pre-primary education`,
        t`1 Primary education`,
        t`2 Lower secondary education`,
        t`3 Upper secondary education`,
        t`4 Post-secondary non-tertiary education`,
        t`5 Short-cycle tertiary education`,
        t`6 Bachelor or equivalent`,
        t`7 Master or equivalent`,
        t`8 Doctoral or equivalent`
    ]
}

export const FormatDropdown: DropdownField  =  {
    label: t`Format`,
    options:  [
        t`0.1 Early childhood educational development`,
        t`0.2 Pre-primary education`,
        t`1 Primary education`,
        t`2 Lower secondary education`,
        t`3 Upper secondary education`,
        t`4 Post-secondary non-tertiary education`,
        t`5 Short-cycle tertiary education`,
        t`6 Bachelor or equivalent`,
        t`7 Master or equivalent`,
        t`8 Doctoral or equivalent`
    ]
}

export const MonthDropdown: DropdownField  =  {
    label: t`Original Creation Date`,
    placeholder: t`Month`,
    options:  [
        t`January`,
        t`February`,
        t`March`,
        t`April`,
        t`May`,
        t`June`,
        t`July`,
        t`August`,
        t`September`,
        t`October`,
        t`November`,
        t`December`
    ]
}

export const YearsDropdown: DropdownField  =  {
    label: t``,
    placeholder: t`Year`,
    options: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'].reverse()
}

export const TypeDropdown: DropdownField  =  {
    label: t`Type`,
    options:  [
        t`0.1 Early childhood educational development`,
        t`0.2 Pre-primary education`,
        t`1 Primary education`,
        t`2 Lower secondary education`,
        t`3 Upper secondary education`,
        t`4 Post-secondary non-tertiary education`,
        t`5 Short-cycle tertiary education`,
        t`6 Bachelor or equivalent`,
        t`7 Master or equivalent`,
        t`8 Doctoral or equivalent`
    ]
}

export const LanguagesDropdown: DropdownField  =  {
    label: t`Languages`,
    options:  [
        t`0.1 Early childhood educational development`,
        t`0.2 Pre-primary education`,
        t`1 Primary education`,
        t`2 Lower secondary education`,
        t`3 Upper secondary education`,
        t`4 Post-secondary non-tertiary education`,
        t`5 Short-cycle tertiary education`,
        t`6 Bachelor or equivalent`,
        t`7 Master or equivalent`,
        t`8 Doctoral or equivalent`
    ]
}

const by = <img src={byIcon} alt="BY"/>
const zero = <img src={zeroIcon} alt="CCO"/>
const nc = <img src={ncIcon} alt="CCO"/>
const nd = <img src={ndIcon} alt="BY"/>
const sa = <img src={saIcon} alt="CCO"/>

export const LicenseDropdown: DropdownField  =  {
    placeholder: t`License`,
    options: [
        ['CCO (Public domain)', <div>{zero}</div>],
        ['CC-BY (Attribution)', <div>{zero}{by}</div>],
        ['CC-BY-SA (Attribution-ShareAlike)', <div>{zero}{by}{sa}</div>],
        ['CC-BY-NC (Attribution-NonCommercial)', <div>{zero}{by}{nc}</div>],
        ['CC-BY-NC-SA (Attribution-NonCommercial-ShareAlike)', <div>{zero}{by}{nc}{sa}</div>],
        ['CC-BY-ND (Attribution-NonCommercial)', <div>{zero}{by}{nd}</div>],
        ['CC-BY-NC-ND (Attribution-NonCommercial-NoDerivatives)', <div>{zero}{by}{nc}{nd}</div>],
    ]
}

export const CategoriesDropdown: DropdownField  =  {
    label: t`Categories`,
    options:  `0000 Generic programmes and qualifications not further defined
        0011 Basic programmes and qualifications
        0021 Literacy and numeracy
        0031 Personal skills and development
        0099 Generic programmes and qualifications not elsewhere classified
        0110 Education not further defined
        0111 Education science
        0112 Training for pre-school teachers
        0113 Teacher training without subject specialisation
        0114 Teacher training with subject specialisation
        0119 Education not elsewhere classified
        0188 Inter-disciplinary programmes and qualifications involving education
        0200 Arts and humanities not further defined
        0211 Audio-visual techniques and media production
        0212 Fashion, interior and industrial design
        0213 Fine arts
        0214 Handicrafts
        0215 Music and performing arts
        0219 Arts not elsewhere classified
        0220 Humanities (except languages) not further defined
        0221 Religion and theology
        0222 History and archaeology
        0223 Philosophy and ethics
        0229 Humanities (except languages) not elsewhere classified
        0230 Languages not further defined
        0231 Language acquisition
        0232 Literature and linguistics
        0239 Languages not elsewhere classified
        0288 Inter-disciplinary programmes and qualifications involving arts and humanities
        0299 Arts and humanities not elsewhere classified
        0300 Social sciences, journalism and information not further defined
        0310 Social and behavioural sciences not further defined
        0311 Economics
        0312 Political sciences and civics
        0313 Psychology
        0314 Sociology and cultural studies
        0319 Social and behavioural sciences not elsewhere classified
        0320 Journalism and information not further defined
        0321 Journalism and reporting
        0322 Library, information and archival studies
        0329 Journalism and information not elsewhere classified
        0388 Inter-disciplinary programmes and qualifications involving social sciences, journalism and information
        0399 Social sciences, journalism and information not elsewhere classified
        0400 Business, administration and law not further defined
        0410 Business and administration not further defined
        0411 Accounting and taxation
        0412 Finance, banking and insurance
        0413 Management and administration
        0414 Marketing and advertising
        0415 Secretarial and office work
        0416 Wholesale and retail sales
        0417 Work skills
        0419 Business and administration not elsewhere classified
        0421 Law
        0488 Inter-disciplinary programmes and qualifications involving business, administration and law
        0499 Business, administration and law not elsewhere classified
        0500 Natural sciences, mathematics and statistics not further defined
        0510 Biological and related sciences not further defined
        0511 Biology
        0512 Biochemistry
        0519 Biological and related sciences not elsewhere classified
        0520 Environment not further defined
        0521 Environmental sciences
        0522 Natural environments and wildlife
        0529 Environment not elsewhere classified
        0530 Physical sciences not further defined
        0531 Chemistry
        0532 Earth sciences
        0533 Physics
        0539 Physical sciences not elsewhere classified
        0540 Mathematics and statistics not further defined
        0541 Mathematics
        0542 Statistics
        0588 Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics
        0599 Natural sciences, mathematics and statistics not elsewhere classified
        0610 Information and Communication Technologies (ICTs) not further defined
        0611 Computer use
        0612 Database and network design and administration
        0613 Software and applications development and analysis
        0619 Information and Communication Technologies (ICTs) not elsewhere classified
        0688 Inter-disciplinary programmes and qualifications involving Information and Communication Technologies (ICTs) Broad field Narrow field Detailed field
        0700 Engineering, manufacturing and construction not further defined
        0710 Engineering and engineering trades not further defined
        0711 Chemical engineering and processes
        0712 Environmental protection technology
        0713 Electricity and energy
        0714 Electronics and automation
        0715 Mechanics and metal trades
        0716 Motor vehicles, ships and aircraft
        0719 Engineering and engineering trades not elsewhere classified
        0720 Manufacturing and processing not further defined
        0721 Food processing
        0722 Materials (glass, paper, plastic and wood)
        0723 Textiles (clothes, footwear and leather)
        0724 Mining and extraction
        0729 Manufacturing and processing not elsewhere classified
        0730 Architecture and construction not further defined
        0731 Architecture and town planning
        0732 Building and civil engineering
        0788 Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction
        0799 Engineering, manufacturing and construction not elsewhere classified
        0800 Agriculture, forestry, fisheries and veterinary not further defined
        0810 Agriculture not further defined
        0811 Crop and livestock production
        0812 Horticulture
        0819 Agriculture not elsewhere classified
        0821 Forestry
        0831 Fisheries
        0841 Veterinary
        0888 Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary
        0899 Agriculture, forestry, fisheries and veterinary not elsewhere classified
        0900 Health and welfare not further defined
        0910 Health not further defined
        0911 Dental studies
        0912 Medicine
        0913 Nursing and midwifery
        0914 Medical diagnostic and treatment technology
        0915 Therapy and rehabilitation
        0916 Pharmacy
        0917 Traditional and complementary medicine and therapy
        0919 Health not elsewhere classified
        0920 Welfare not further defined
        0921 Care of the elderly and of disabled adults
        0922 Child care and youth services
        0923 Social work and counselling
        0929 Welfare not elsewhere classified
        0988 Inter-disciplinary programmes and qualifications involving health and welfare
        0999 Health and welfare not elsewhere classified
        1000 Services not further defined
        1010 Personal services not further defined
        1011 Domestic services
        1012 Hair and beauty services
        1013 Hotel, restaurants and catering
        1014 Sports
        1015 Travel, tourism and leisure
        1019 Personal services not elsewhere classified
        1020 Hygiene and occupational health services not further defined
        1021 Community sanitation
        1022 Occupational health and safety
        1029 Hygiene and occupational health services not elsewhere classified
        1030 Security services not further defined
        1031 Military and defence
        1032 Protection of persons and property
        1039 Security services not elsewhere classified
        1041 Transport services
        1088 Inter-disciplinary programmes and qualifications involving services
        1099 Services not elsewhere classified
        9999 Field unknown`.split(/\r?\n/).map(s => t`${s}`)
}