import { useFormik } from 'formik';
import { FC } from 'react';
import { ResourceFormValues } from '../../../../common/types.mjs';
import './ResourceCard.scss';
export type ResourceCardPropsControlled = Omit<ResourceCardProps, 'isEditing' | 'toggleIsEditing'>;
export type ResourceCardProps = {
    form: ReturnType<typeof useFormik<ResourceFormValues>>;
    isAuthenticated: boolean;
    isEditing?: boolean;
    isOwner?: boolean;
    canEdit?: boolean;
    isAdmin?: boolean;
    isApproved?: boolean;
    isFollowing?: boolean;
    toggleIsEditing(): unknown;
};
export declare const ResourceCard: FC<ResourceCardProps>;
//# sourceMappingURL=ResourceCard.d.ts.map