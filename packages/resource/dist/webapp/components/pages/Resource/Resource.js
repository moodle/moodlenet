import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MainLayout } from '@moodlenet/react-app/ui';
import { useReducer } from 'react';
import { ResourceCard, } from '../../organisms/ResourceCard/ResourceCard.js';
import './Resource.scss';
export const Resource = ({ mainLayoutProps, resourceCardProps, mainColumnItems, sideColumnItems, }) => {
    const [isEditing, toggleIsEditing] = useReducer(_ => !_, false);
    const updatedMainColumnItems = [...(mainColumnItems ?? [])];
    return (_jsx(MainLayout, { ...mainLayoutProps, children: _jsx("div", { className: "resource", children: _jsxs("div", { className: "content", children: [_jsxs("div", { className: "main-column", children: [_jsx(ResourceCard, { ...resourceCardProps, 
                                // editForm={editForm}
                                isEditing: isEditing, toggleIsEditing: toggleIsEditing }), updatedMainColumnItems.map(i => (_jsx(i.Item, {}, i.key)))] }), _jsx("div", { className: "side-column", children: sideColumnItems?.map(i => (_jsx(i.Item, {}, i.key))) })] }) }) }));
};
Resource.displayName = 'ResourcePage';
export default Resource;
//# sourceMappingURL=Resource.js.map