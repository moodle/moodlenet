import { eduIscedFieldRecord } from '../types'
/* tslint:disable */
/* eslint-disable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck: because is raw data and it's massive, it will slowdown ts
// @ts-ignore: because is raw data and it's massive, it will slowdown ts

export const eduIscedFieldsSetup = _eduIscedFieldsSetup().map<eduIscedFieldRecord>(record => ({
  ...record,
  code: record.codePath.join(''),
  enabled: record.codePath.length === 3,
}))

function _eduIscedFieldsSetup(): Omit<eduIscedFieldRecord, 'code' | 'enabled'>[] {
  return [
    {
      codePath: ['10', '1', '5'],
      description: 'Travel, tourism and leisure',
    },
    {
      codePath: ['10', '1', '0'],
      description: 'Personal services not further defined',
    },
    {
      codePath: ['10', '0'],
      description: 'Services not further defined',
    },
    {
      codePath: ['08'],
      description: 'Agriculture, forestry, fisheries and veterinary',
    },
    {
      codePath: ['05', '3', '3'],
      description: 'Physics',
    },
    {
      codePath: ['09', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving health and welfare',
    },
    {
      codePath: ['09', '2', '9'],
      description: 'Welfare not elsewhere classified',
    },
    {
      codePath: ['09', '2', '2'],
      description: 'Child care and youth services',
    },
    {
      codePath: ['05', '2', '9'],
      description: 'Environment not elsewhere classified',
    },
    {
      codePath: ['04', '2', '1'],
      description: 'Law',
    },
    {
      codePath: ['09', '2', '0'],
      description: 'Welfare not further defined',
    },
    {
      codePath: ['04', '1', '6'],
      description: 'Wholesale and retail sales',
    },
    {
      codePath: ['09', '1', '9'],
      description: 'Health not elsewhere classified',
    },
    {
      codePath: ['09', '1', '7'],
      description: 'Traditional and complementary medicine and therapy',
    },
    {
      codePath: ['09', '1', '5'],
      description: 'Therapy and rehabilitation',
    },
    {
      codePath: ['09', '1', '3'],
      description: 'Nursing and midwifery',
    },
    {
      codePath: ['02', '1', '4'],
      description: 'Handicrafts',
    },
    {
      codePath: ['01'],
      description: 'Education',
    },
    {
      codePath: ['10', '3', '0'],
      description: 'Security services not further defined',
    },
    {
      codePath: ['08', '2', '1'],
      description: 'Forestry',
    },
    {
      codePath: ['04', '0'],
      description: 'Business, administration and law not further defined',
    },
    {
      codePath: ['02', '2'],
      description: 'Humanities (except languages)',
    },
    {
      codePath: ['00', '3', '1'],
      description: 'Personal skills and development',
    },
    {
      codePath: ['09', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving health and welfare',
    },
    {
      codePath: ['03', '2', '1'],
      description: 'Journalism and reporting',
    },
    {
      codePath: ['00', '1', '1'],
      description: 'Basic programmes and qualifications',
    },
    {
      codePath: ['00', '9'],
      description: 'Generic programmes and qualifications not elsewhere classified',
    },
    {
      codePath: ['04', '1', '9'],
      description: 'Business and administration not elsewhere classified',
    },
    {
      codePath: ['02', '3'],
      description: 'Languages',
    },
    {
      codePath: ['01', '1', '1'],
      description: 'Education science',
    },
    {
      codePath: ['04', '9', '9'],
      description: 'Business, administration and law not elsewhere classified',
    },
    {
      codePath: ['05', '2', '2'],
      description: 'Natural environments and wildlife',
    },
    {
      codePath: ['05', '1', '2'],
      description: 'Biochemistry',
    },
    {
      codePath: ['02', '1', '1'],
      description: 'Audio-visual techniques and media production',
    },
    {
      codePath: ['01', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving education',
    },
    {
      codePath: ['02', '1', '2'],
      description: 'Fashion, interior and industrial design',
    },
    {
      codePath: ['02', '2', '2'],
      description: 'History and archaeology',
    },
    {
      codePath: ['00', '2', '1'],
      description: 'Literacy and numeracy',
    },
    {
      codePath: ['07', '1', '1'],
      description: 'Chemical engineering and processes',
    },
    {
      codePath: ['10', '0', '0'],
      description: 'Services not further defined',
    },
    {
      codePath: ['02', '0', '0'],
      description: 'Arts and humanities not further defined',
    },
    {
      codePath: ['05', '3', '2'],
      description: 'Earth sciences',
    },
    {
      codePath: ['01', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving education',
    },
    {
      codePath: ['02', '2', '0'],
      description: 'Humanities (except languages) not further defined',
    },
    {
      codePath: ['04', '1', '3'],
      description: 'Management and administration',
    },
    {
      codePath: ['05', '3', '9'],
      description: 'Physical sciences not elsewhere classified',
    },
    {
      codePath: ['02', '3', '9'],
      description: 'Languages not elsewhere classified',
    },
    {
      codePath: ['01', '1', '2'],
      description: 'Training for pre-school teachers',
    },
    {
      codePath: ['04', '1', '7'],
      description: 'Work skills',
    },
    {
      codePath: ['08', '3'],
      description: 'Fisheries',
    },
    {
      codePath: ['08', '1', '2'],
      description: 'Horticulture',
    },
    {
      codePath: ['10', '3', '2'],
      description: 'Protection of persons and property',
    },
    {
      codePath: ['02', '9'],
      description: 'Arts and humanities not elsewhere classified',
    },
    {
      codePath: ['03', '0', '0'],
      description: 'Social sciences, journalism and information not further defined',
    },
    {
      codePath: ['02', '2', '1'],
      description: 'Religion and theology',
    },
    {
      codePath: ['00', '0'],
      description: 'Generic programmes and qualifications not further defined',
    },
    {
      codePath: ['09', '1', '0'],
      description: 'Health not further defined',
    },
    {
      codePath: ['07', '1', '4'],
      description: 'Electronics and automation',
    },
    {
      codePath: ['07', '1'],
      description: 'Engineering and engineering trades',
    },
    {
      codePath: ['02', '1', '3'],
      description: 'Fine arts',
    },
    {
      codePath: ['05', '2'],
      description: 'Environment',
    },
    {
      codePath: ['05', '1', '9'],
      description: 'Biological and related sciences not elsewhere classified',
    },
    {
      codePath: ['05', '9'],
      description: 'Natural sciences, mathematics and statistics not elsewhere classified',
    },
    {
      codePath: ['00', '9', '9'],
      description: 'Generic programmes and qualifications not elsewhere classified',
    },
    {
      codePath: ['07', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction',
    },
    {
      codePath: ['04', '9'],
      description: 'Business, administration and law not elsewhere classified',
    },
    {
      codePath: ['02', '3', '0'],
      description: 'Languages not further defined',
    },
    {
      codePath: ['03', '9', '9'],
      description: 'Social sciences, journalism and information not elsewhere classified',
    },
    {
      codePath: ['01', '1', '3'],
      description: 'Teacher training without subject specialisation',
    },
    {
      codePath: ['04', '1', '0'],
      description: 'Business and administration not further defined',
    },
    {
      codePath: ['10', '9', '9'],
      description: 'Services not elsewhere classified',
    },
    {
      codePath: ['03'],
      description: 'Social sciences, journalism and information',
    },
    {
      codePath: ['07', '1', '3'],
      description: 'Electricity and energy',
    },
    {
      codePath: ['10'],
      description: 'Services',
    },
    {
      codePath: ['03', '1', '9'],
      description: 'Social and behavioural sciences not elsewhere classified',
    },
    {
      codePath: ['02', '3', '2'],
      description: 'Literature and linguistics',
    },
    {
      codePath: ['03', '9'],
      description: 'Social sciences, journalism and information not elsewhere classified',
    },
    {
      codePath: ['01', '1', '0'],
      description: 'Education not further defined',
    },
    {
      codePath: ['10', '1', '1'],
      description: 'Domestic services',
    },
    {
      codePath: ['05', '1'],
      description: 'Biological and related sciences',
    },
    {
      codePath: ['04', '1'],
      description: 'Business and administration',
    },
    {
      codePath: ['05', '0', '0'],
      description: 'Natural sciences, mathematics and statistics not further defined',
    },
    {
      codePath: ['04', '1', '5'],
      description: 'Secretarial and office work',
    },
    {
      codePath: ['10', '4', '1'],
      description: 'Transport services',
    },
    {
      codePath: ['07', '1', '5'],
      description: 'Mechanics and metal trades',
    },
    {
      codePath: ['08', '4'],
      description: 'Veterinary',
    },
    {
      codePath: ['07', '1', '2'],
      description: 'Environmental protection technology',
    },
    {
      codePath: ['04', '0', '0'],
      description: 'Business, administration and law not further defined',
    },
    {
      codePath: ['10', '3', '9'],
      description: 'Security services not elsewhere classified',
    },
    {
      codePath: ['04', '1', '2'],
      description: 'Finance, banking and insurance',
    },
    {
      codePath: ['04', '1', '4'],
      description: 'Marketing and advertising',
    },
    {
      codePath: ['10', '4'],
      description: 'Transport services',
    },
    {
      codePath: ['02', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving arts and humanities',
    },
    {
      codePath: ['10', '3'],
      description: 'Security services',
    },
    {
      codePath: ['10', '2', '0'],
      description: 'Hygiene and occupational health services not further defined',
    },
    {
      codePath: ['10', '1', '9'],
      description: 'Personal services not elsewhere classified',
    },
    {
      codePath: ['05', '3'],
      description: 'Physical sciences',
    },
    {
      codePath: ['08', '1'],
      description: 'Agriculture',
    },
    {
      codePath: ['10', '9'],
      description: 'Services not elsewhere classified',
    },
    {
      codePath: ['04', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving business, administration and law',
    },
    {
      codePath: ['10', '3', '1'],
      description: 'Military and defence',
    },
    {
      codePath: ['09', '0'],
      description: 'Health and welfare not further defined',
    },
    {
      codePath: ['05', '2', '0'],
      description: 'Environment not further defined',
    },
    {
      codePath: ['00'],
      description: 'Generic programmes and qualifications',
    },
    {
      codePath: ['03', '2'],
      description: 'Journalism and information',
    },
    {
      codePath: ['03', '2', '9'],
      description: 'Journalism and information not elsewhere classified',
    },
    {
      codePath: ['10', '1'],
      description: 'Personal services',
    },
    {
      codePath: ['03', '2', '0'],
      description: 'Journalism and information not further defined',
    },
    {
      codePath: ['08', '8'],
      description:
        'Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary',
    },
    {
      codePath: ['10', '2'],
      description: 'Hygiene and occupational health services',
    },
    {
      codePath: ['03', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving social sciences, journalism and information',
    },
    {
      codePath: ['03', '1', '2'],
      description: 'Political sciences and civics',
    },
    {
      codePath: ['08', '9', '9'],
      description: 'Agriculture, forestry, fisheries and veterinary not elsewhere classified',
    },
    {
      codePath: ['03', '1', '1'],
      description: 'Economics',
    },
    {
      codePath: ['05', '0'],
      description: 'Natural sciences, mathematics and statistics not further defined',
    },
    {
      codePath: ['01', '1', '4'],
      description: 'Teacher training with subject specialisation',
    },
    {
      codePath: ['03', '1'],
      description: 'Social and behavioural sciences',
    },
    {
      codePath: ['02', '1'],
      description: 'Arts',
    },
    {
      codePath: ['03', '1', '4'],
      description: 'Sociology and cultural studies',
    },
    {
      codePath: ['02', '1', '0'],
      description: 'Arts not further defined',
    },
    {
      codePath: ['09', '1', '6'],
      description: 'Pharmacy',
    },
    {
      codePath: ['03', '1', '3'],
      description: 'Psychology',
    },
    {
      codePath: ['03', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving social sciences, journalism and information',
    },
    {
      codePath: ['03', '2', '2'],
      description: 'Library, information and archival studies',
    },
    {
      codePath: ['03', '1', '0'],
      description: 'Social and behavioural sciences not further defined',
    },
    {
      codePath: ['10', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving services',
    },
    {
      codePath: ['10', '2', '9'],
      description: 'Hygiene and occupational health services not elsewhere classified',
    },
    {
      codePath: ['02', '1', '9'],
      description: 'Arts not elsewhere classified',
    },
    {
      codePath: ['02', '2', '9'],
      description: 'Humanities (except languages) not elsewhere classified',
    },
    {
      codePath: ['09', '1'],
      description: 'Health',
    },
    {
      codePath: ['05', '1', '1'],
      description: 'Biology',
    },
    {
      codePath: ['05', '4', '2'],
      description: 'Statistics',
    },
    {
      codePath: ['02', '2', '3'],
      description: 'Philosophy and ethics',
    },
    {
      codePath: ['05', '2', '1'],
      description: 'Environmental sciences',
    },
    {
      codePath: ['05', '1', '0'],
      description: 'Biological and related sciences not further defined',
    },
    {
      codePath: ['02', '3', '1'],
      description: 'Language acquisition',
    },
    {
      codePath: ['09'],
      description: 'Health and welfare',
    },
    {
      codePath: ['04'],
      description: 'Business, administration and law',
    },
    {
      codePath: ['09', '2'],
      description: 'Welfare',
    },
    {
      codePath: ['05', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics',
    },
    {
      codePath: ['05'],
      description: 'Natural sciences, mathematics and statistics',
    },
    {
      codePath: ['10', '2', '1'],
      description: 'Community sanitation',
    },
    {
      codePath: ['02', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving arts and humanities',
    },
    {
      codePath: ['10', '1', '3'],
      description: 'Hotel, restaurants and catering',
    },
    {
      codePath: ['07', '0'],
      description: 'Engineering, manufacturing and construction not further defined',
    },
    {
      codePath: ['10', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving services',
    },
    {
      codePath: ['02', '9', '9'],
      description: 'Arts and humanities not elsewhere classified',
    },
    {
      codePath: ['07', '9'],
      description: 'Engineering, manufacturing and construction not elsewhere classified',
    },
    {
      codePath: ['05', '3', '0'],
      description: 'Physical sciences not further defined',
    },
    {
      codePath: ['09', '1', '4'],
      description: 'Medical diagnostic and treatment technology',
    },
    {
      codePath: ['04', '2'],
      description: 'Law',
    },
    {
      codePath: ['09', '9'],
      description: 'Health and welfare not elsewhere classified',
    },
    {
      codePath: ['02'],
      description: 'Arts and humanities',
    },
    {
      codePath: ['05', '3', '1'],
      description: 'Chemistry',
    },
    {
      codePath: ['02', '1', '5'],
      description: 'Music and performing arts',
    },
    {
      codePath: ['09', '1', '2'],
      description: 'Medicine',
    },
    {
      codePath: ['05', '4'],
      description: 'Mathematics and statistics',
    },
    {
      codePath: ['05', '4', '0'],
      description: 'Mathematics and statistics not further defined',
    },
    {
      codePath: ['05', '4', '1'],
      description: 'Mathematics',
    },
    {
      codePath: ['00', '3'],
      description: 'Personal skills and development',
    },
    {
      codePath: ['05', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics',
    },
    {
      codePath: ['06'],
      description: 'Information and Communication Technologies',
    },
    {
      codePath: ['09', '2', '1'],
      description: 'Care of the elderly and of disabled adults',
    },
    {
      codePath: ['09', '9', '9'],
      description: 'Health and welfare not elsewhere classified',
    },
    {
      codePath: ['06', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving information and Communication Technologies',
    },
    {
      codePath: ['06', '1', '0'],
      description: 'Information and Communication Technologies not further defined',
    },
    {
      codePath: ['00', '0', '0'],
      description: 'Generic programmes and qualifications not further defined',
    },
    {
      codePath: ['07', '2', '4'],
      description: 'Mining and extraction',
    },
    {
      codePath: ['06', '1', '1'],
      description: 'Computer use',
    },
    {
      codePath: ['08', '3', '1'],
      description: 'Fisheries',
    },
    {
      codePath: ['10', '1', '2'],
      description: 'Hair and beauty services',
    },
    {
      codePath: ['06', '1', '2'],
      description: 'Database and network design and administration',
    },
    {
      codePath: ['01', '1', '9'],
      description: 'Education not elsewhere classified',
    },
    {
      codePath: ['06', '1', '3'],
      description: 'Software and applications development and analysis',
    },
    {
      codePath: ['07', '2', '0'],
      description: 'Manufacturing and processing not further defined',
    },
    {
      codePath: ['06', '1', '9'],
      description: 'Information and Communication Technologies not elsewhere classified',
    },
    {
      codePath: ['06', '8', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving information and Communication Technologies',
    },
    {
      codePath: ['07'],
      description: 'Engineering, manufacturing and construction',
    },
    {
      codePath: ['07', '2', '2'],
      description: 'Materials (glass, paper, plastic and wood)',
    },
    {
      codePath: ['03', '0'],
      description: 'Social sciences, journalism and information not further defined',
    },
    {
      codePath: ['07', '0', '0'],
      description: 'Engineering, manufacturing and construction not further defined',
    },
    {
      codePath: ['07', '1', '0'],
      description: 'Engineering and engineering trades not further defined',
    },
    {
      codePath: ['07', '2'],
      description: 'Manufacturing and processing',
    },
    {
      codePath: ['00', '1'],
      description: 'Basic programmes and qualifications',
    },
    {
      codePath: ['07', '1', '9'],
      description: 'Engineering and engineering trades not elsewhere classified',
    },
    {
      codePath: ['07', '2', '1'],
      description: 'Food processing',
    },
    {
      codePath: ['00', '2'],
      description: 'Literacy and numeracy',
    },
    {
      codePath: ['07', '2', '3'],
      description: 'Textiles (clothes, footwear and leather)',
    },
    {
      codePath: ['07', '2', '9'],
      description: 'Manufacturing and processing not elsewhere classified',
    },
    {
      codePath: ['09', '2', '3'],
      description: 'Social work and counselling',
    },
    {
      codePath: ['07', '3'],
      description: 'Architecture and construction',
    },
    {
      codePath: ['07', '3', '0'],
      description: 'Architecture and construction not further defined',
    },
    {
      codePath: ['10', '2', '2'],
      description: 'Occupational health and safety',
    },
    {
      codePath: ['07', '3', '1'],
      description: 'Architecture and town planning',
    },
    {
      codePath: ['07', '3', '2'],
      description: 'Building and civil engineering',
    },
    {
      codePath: ['05', '9', '9'],
      description: 'Natural sciences, mathematics and statistics not elsewhere classified',
    },
    {
      codePath: ['07', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction',
    },
    {
      codePath: ['07', '9', '9'],
      description: 'Engineering, manufacturing and construction not elsewhere classified',
    },
    {
      codePath: ['08', '0'],
      description: 'Agriculture, forestry, fisheries and veterinary not further defined',
    },
    {
      codePath: ['01', '1'],
      description: 'Education',
    },
    {
      codePath: ['06', '1'],
      description: 'Information and Communication Technologies',
    },
    {
      codePath: ['08', '0', '0'],
      description: 'Agriculture, forestry, fisheries and veterinary not further defined',
    },
    {
      codePath: ['10', '1', '4'],
      description: 'Sports',
    },
    {
      codePath: ['08', '1', '1'],
      description: 'Crop and livestock production',
    },
    {
      codePath: ['04', '8'],
      description: 'Inter-disciplinary programmes and qualifications involving business, administration and law',
    },
    {
      codePath: ['08', '1', '9'],
      description: 'Agriculture not elsewhere classified',
    },
    {
      codePath: ['02', '0'],
      description: 'Arts and humanities not further defined',
    },
    {
      codePath: ['08', '2'],
      description: 'Forestry',
    },
    {
      codePath: ['04', '1', '1'],
      description: 'Accounting and taxation',
    },
    {
      codePath: ['08', '4', '1'],
      description: 'Veterinary',
    },
    {
      codePath: ['08', '8', '8'],
      description:
        'Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary',
    },
    {
      codePath: ['08', '9'],
      description: 'Agriculture, forestry, fisheries and veterinary not elsewhere classified',
    },
    {
      codePath: ['08', '1', '0'],
      description: 'Agriculture not further defined',
    },
    {
      codePath: ['09', '0', '0'],
      description: 'Health and welfare not further defined',
    },
    {
      codePath: ['09', '1', '1'],
      description: 'Dental studies',
    },
    {
      codePath: ['07', '1', '6'],
      description: 'Motor vehicles, ships and aircraft',
    },
  ]
}
