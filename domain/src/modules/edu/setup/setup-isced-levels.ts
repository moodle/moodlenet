import { eduIscedLevelRecord } from '../types'
/* tslint:disable */
/* eslint-disable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck: because is raw data and it's massive, it will slowdown ts
// @ts-ignore: because is raw data and it's massive, it will slowdown ts

export const eduIscedLevelsSetup = _eduIscedLevelsSetup().map<eduIscedLevelRecord>(record => ({
  ...record,
  id: record.codePath.join(''),
  enabled: true,
}))

function _eduIscedLevelsSetup(): Omit<eduIscedLevelRecord, 'id' | 'enabled'>[] {
  return [
    {
      codePath: ['6', '6', '1'],
      description: "Bachelor's or equivalent - orientation unspecified, insufficient for level completion",
    },
    {
      codePath: ['0', '2'],
      description: 'Pre-primary education',
    },
    {
      codePath: ['6', '6'],
      description: "Bachelor's or equivalent - orientation unspecified",
    },
    {
      codePath: ['3', '5', '1'],
      description:
        'Upper secondary education - vocational, insufficient for level completion or partial level completion, without direct access to tertiary education',
    },
    {
      codePath: ['6', '5'],
      description: "Bachelor's or equivalent - professional",
    },
    {
      codePath: ['6', '4', '6'],
      description: "Bachelor's or equivalent - academic, long first degree (more than 4 years)",
    },
    {
      codePath: ['6', '4', '5'],
      description: "Bachelor's or equivalent - academic, first degree (3-4 years)",
    },
    {
      codePath: ['6', '5', '7'],
      description:
        "Bachelor's or equivalent - professional, second or further degree (following a Bachelor's or equivalent programme)",
    },
    {
      codePath: ['5', '5', '1'],
      description: 'Tertiary education - vocational/professional, insufficient for level completion',
    },
    {
      codePath: ['6', '4', '1'],
      description: "Bachelor's or equivalent - academic, insufficient for level completion",
    },
    {
      codePath: ['3', '5', '2'],
      description:
        'Upper secondary education - vocational, sufficient for partial level completion, without direct access to tertiary education',
    },
    {
      codePath: ['6'],
      description: 'Bachelor’s or equivalent',
    },
    {
      codePath: ['3', '5', '3'],
      description:
        'Upper secondary education - vocational, sufficient for level completion, without direct access to tertiary education',
    },
    {
      codePath: ['7', '5', '8'],
      description:
        "Master's or equivalent - professional, second or further degree (following a Master's or equivalent programme)",
    },
    {
      codePath: ['5', '5', '4'],
      description: 'Tertiary education - vocational/professional, sufficient for level completion',
    },
    {
      codePath: ['2'],
      description: 'Lower secondary education',
    },
    {
      codePath: ['5', '5'],
      description: 'Tertiary education - vocational/professional',
    },
    {
      codePath: ['5', '4', '1'],
      description: 'Tertiary education - general/academic, insufficient for level completion',
    },
    {
      codePath: ['4', '5'],
      description: 'Post-secondary non-tertiary education - vocational',
    },
    {
      codePath: ['4', '5', '4'],
      description:
        'Post-secondary non-tertiary education - vocational, sufficient for level completion, with direct access to tertiary education',
    },
    {
      codePath: ['4', '5', '3'],
      description:
        'Post-secondary non-tertiary education - vocational, sufficient for level completion, without direct access to tertiary education',
    },
    {
      codePath: ['4'],
      description: 'Post-secondary non-tertiary education',
    },
    {
      codePath: ['0', '1'],
      description: 'Early childhood educational development',
    },
    {
      codePath: ['7', '4', '1'],
      description: "Master's or equivalent - academic, insufficient for level completion",
    },
    {
      codePath: ['6', '6', '7'],
      description:
        "Bachelor's or equivalent - orientation unspecified, second or further degree (following a Bachelor's or equivalent programme)",
    },
    {
      codePath: ['5', '4', '4'],
      description: 'Tertiary education - general/academic, sufficient for level completion',
    },
    {
      codePath: ['2', '5'],
      description: 'Lower secondary education - vocational',
    },
    {
      codePath: ['7', '6'],
      description: "Master's or equivalent - orientation unspecified",
    },
    {
      codePath: ['4', '4', '1'],
      description:
        'Post-secondary non-tertiary education - general, insufficient for level completion, without direct access to tertiary education',
    },
    {
      codePath: ['4', '4', '4'],
      description:
        'Post-secondary non-tertiary education - general, sufficient for level completion, with direct access to tertiary education',
    },
    {
      codePath: ['6', '5', '5'],
      description: "Bachelor's or equivalent - professional, first degree (3-4 years)",
    },
    {
      codePath: ['8'],
      description: 'Doctoral or equivalent',
    },
    {
      codePath: ['4', '4'],
      description: 'Post-secondary non-tertiary education - general',
    },
    {
      codePath: ['ADT'],
      description: 'Adult Education',
    },
    {
      codePath: ['7', '5'],
      description: "Master's or equivalent - professional",
    },
    {
      codePath: ['3'],
      description: 'Upper secondary education',
    },
    {
      codePath: ['6', '6', '6'],
      description: "Bachelor's or equivalent - orientation unspecified, long first degree (more than 4 years)",
    },
    {
      codePath: ['7', '5', '7'],
      description:
        "Master's or equivalent - professional, second or further degree (following a Bachelor's or equivalent programme)",
    },
    {
      codePath: ['7', '4', '6'],
      description: "Master's or equivalent - academic, long first degree (at least 5 years)",
    },
    {
      codePath: ['7', '5', '1'],
      description: "Master's or equivalent - professional, insufficient for level completion",
    },
    {
      codePath: ['7', '5', '6'],
      description: "Master's or equivalent - professional, long first degree (at least 5 years)",
    },
    {
      codePath: ['7', '6', '6'],
      description: "Master's or equivalent - orientation unspecified, long first degree (at least 5 years)",
    },
    {
      codePath: ['4', '4', '3'],
      description:
        'Post-secondary non-tertiary education - general, sufficient for level completion, without direct access to tertiary education',
    },
    {
      codePath: ['7', '6', '7'],
      description:
        "Master's or equivalent - orientation unspecified, second or further degree (following a Bachelor's or equivalent programme)",
    },
    {
      codePath: ['7', '6', '8'],
      description:
        "Master's or equivalent - orientation unspecified, second or further degree (following a Master's or equivalent programme)",
    },
    {
      codePath: ['7', '4', '7'],
      description:
        "Master's or equivalent - academic, second or further degree (following a Bachelor's or equivalent programme)",
    },
    {
      codePath: ['3', '5'],
      description: 'Upper secondary education - vocational',
    },
    {
      codePath: ['3', '4', '4'],
      description:
        'Upper secondary education - general, sufficient for level completion, with direct access to tertiary education',
    },
    {
      codePath: ['2', '4'],
      description: 'Lower secondary education - general',
    },
    {
      codePath: ['5'],
      description: 'Tertiary education',
    },
    {
      codePath: ['7', '4', '8'],
      description:
        "Master's or equivalent - academic, second or further degree (following a Master's or equivalent programme)",
    },
    {
      codePath: ['3', '4', '3'],
      description:
        'Upper secondary education - general, sufficient for level completion, without direct access to tertiary education',
    },
    {
      codePath: ['6', '5', '6'],
      description: "Bachelor's or equivalent - professional, long first degree (more than 4 years)",
    },
    {
      codePath: ['0'],
      description: 'Early childhood education',
    },
    {
      codePath: ['6', '6', '5'],
      description: "Bachelor's or equivalent - orientation unspecified, first degree (3-4 years)",
    },
    {
      codePath: ['3', '5', '4'],
      description:
        'Upper secondary education - vocational, sufficient for level completion, with direct access to tertiary education',
    },
    {
      codePath: ['4', '5', '1'],
      description:
        'Post-secondary non-tertiary education - vocational, insufficient for level completion, without direct access to tertiary education',
    },
    {
      codePath: ['3', '4'],
      description: 'Upper secondary education - general',
    },
    {
      codePath: ['6', '4'],
      description: "Bachelor's or equivalent - academic",
    },
    {
      codePath: ['7', '6', '1'],
      description: "Master's or equivalent - orientation unspecified, insufficient for level completion",
    },
    {
      codePath: ['7'],
      description: 'Master’s or equivalent',
    },
    {
      codePath: ['3', '4', '1'],
      description:
        'Upper secondary education - general, insufficient for level completion or partial level completion, without direct access to tertiary education',
    },
    {
      codePath: ['6', '5', '1'],
      description: "Bachelor's or equivalent - professional, insufficient for level completion",
    },
    {
      codePath: ['7', '4'],
      description: "Master's or equivalent - academic",
    },
    {
      codePath: ['6', '4', '7'],
      description:
        "Bachelor's or equivalent - academic, second or further degree (following a Bachelor's or equivalent programme)",
    },
    {
      codePath: ['1'],
      description: 'Primary education',
    },
    {
      codePath: ['5', '4'],
      description: 'Tertiary education - general/academic',
    },
    {
      codePath: ['3', '4', '2'],
      description:
        'Upper secondary education - general, sufficient for partial level completion, without direct access to tertiary education',
    },
  ]
}
