import { Visibility } from '@moodlenet/component-library';
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
    isAuthenticated: boolean;
    numLikes: number;
    liked: boolean;
    bookmarked: boolean;
    contentUrl: string;
    resourceFormat: string;
    contentType: 'link' | 'file';
    downloadFilename: string;
    type: string;
};
//# sourceMappingURL=types.d.mts.map