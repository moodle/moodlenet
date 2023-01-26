import { FollowTag, Visibility } from '@moodlenet/component-library';
import { AssetInfo } from '@moodlenet/react-app/common';
export type NewResourceFormValues = {
    name: string;
    description: string;
    category: string;
    content: string | File;
    visibility: Visibility;
    addToCollections: string[];
    license?: string;
    image?: AssetInfo | null;
    type?: string;
    level?: string;
    month?: string;
    year?: string;
    language?: string;
};
export type ResourceType = {
    id: string;
    url: string;
    numLikes: number;
    contentUrl: string;
    resourceFormat: string;
    contentType: 'link' | 'file';
    downloadFilename: string;
    type: string;
};
export type ResourceFormValues = Omit<NewResourceFormValues, 'addToCollections' | 'content'> & {
    isFile: boolean;
};
export type Organization = {
    name: string;
    shortName: string;
    title: string;
    subtitle: string;
    url: string;
    logo: string;
    smallLogo: string;
    color: string;
};
export declare const getResourceTypeInfo: (type: string) => {
    typeName: string;
    typeColor: string;
};
export type ResourceInfo = {
    type: ResourceType;
    title: string;
    tags: Pick<FollowTag, 'name'>[];
    image: string;
};
//# sourceMappingURL=types.d.mts.map