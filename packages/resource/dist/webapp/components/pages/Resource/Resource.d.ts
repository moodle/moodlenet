import { AddonItem, IconTextOptionProps, OptionItemProp, TextOptionProps } from '@moodlenet/component-library';
import { FormikHandle, MainLayoutProps, SelectOptions, SelectOptionsMulti } from '@moodlenet/react-app/ui';
import { FC } from 'react';
import { ResourceFormValues, ResourceType } from '../../../../common/types.mjs';
import { ContributorCardProps } from '../../molecules/ContributorCard/ContributorCard.js';
import { MainResourceCardProps } from '../../organisms/MainResourceCard/MainResourceCard.js';
import './Resource.scss';
export type ResourceProps = {
    mainLayoutProps: MainLayoutProps;
    mainResourceCardProps: MainResourceCardProps;
    mainColumnItems?: AddonItem[];
    sideColumnItems?: AddonItem[];
    moreButtonItems?: AddonItem[];
    resource: ResourceFormValues;
    editResource: (values: ResourceFormValues) => Promise<unknown>;
    isAuthenticated: boolean;
    isOwner: boolean;
    isAdmin: boolean;
    canEdit: boolean;
    autoImageAdded: boolean;
    deleteResource?(): unknown;
    addToCollectionsForm: FormikHandle<{
        collections: string[];
    }>;
    sendToMoodleLmsForm: FormikHandle<{
        site?: string;
    }>;
    contributorCardProps: ContributorCardProps;
    collections: SelectOptionsMulti<OptionItemProp>;
    licenses: SelectOptions<IconTextOptionProps>;
    setCategoryFilter(text: string): unknown;
    categories: SelectOptions<TextOptionProps>;
    setTypeFilter(text: string): unknown;
    types: SelectOptions<TextOptionProps>;
    setLevelFilter(text: string): unknown;
    levels: SelectOptions<TextOptionProps>;
    setLanguageFilter(text: string): unknown;
    languages: SelectOptions<TextOptionProps>;
    downloadFilename: string;
    type: string;
} & ResourceType;
export declare const Resource: FC<ResourceProps>;
export default Resource;
//# sourceMappingURL=Resource.d.ts.map