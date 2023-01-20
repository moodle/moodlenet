import { AddonItem, FollowTag, IconTextOptionProps, OptionItemProp, TextOptionProps } from '@moodlenet/component-library';
import { FormikHandle, MainLayoutProps, SelectOptions, SelectOptionsMulti } from '@moodlenet/react-app/ui';
import { FC } from 'react';
import { NewResourceFormValues } from '../../../../common/types.mjs';
import { ContributorCardProps } from '../../molecules/ContributorCard/ContributorCard.js';
import './Resource.scss';
export type ResourceFormValues = Omit<NewResourceFormValues, 'addToCollections' | 'content'> & {
    isFile: boolean;
};
export type ResourceProps = {
    mainLayoutProps: MainLayoutProps;
    mainColumnItems?: AddonItem[];
    sideColumnItems?: AddonItem[];
    resourceId: string;
    resourceUrl: string;
    isAuthenticated: boolean;
    isOwner: boolean;
    isAdmin: boolean;
    autoImageAdded: boolean;
    canSearchImage: boolean;
    numLikes: number;
    collections: SelectOptionsMulti<OptionItemProp>;
    liked: boolean;
    bookmarked: boolean;
    tags: FollowTag[];
    contributorCardProps: ContributorCardProps;
    form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>;
    contentUrl: string;
    toggleLikeForm: FormikHandle;
    toggleBookmarkForm: FormikHandle;
    deleteResourceForm?: FormikHandle;
    addToCollectionsForm: FormikHandle<{
        collections: string[];
    }>;
    sendToMoodleLmsForm: FormikHandle<{
        site?: string;
    }>;
    reportForm?: FormikHandle<{
        comment: string;
    }>;
    resourceFormat: string;
    contentType: 'link' | 'file';
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
};
export declare const Resource: FC<ResourceProps>;
export default Resource;
//# sourceMappingURL=Resource.d.ts.map