"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.useResourceBaseProps = void 0;
var react_1 = require("react");
var MainContext_js_1 = require("./MainContext.js");
exports.useResourceBaseProps = function (_a) {
    var resourceKey = _a.resourceKey;
    var rpcCaller = react_1.useContext(MainContext_js_1.MainContext).rpcCaller;
    var _b = react_1.useState(), resourceResp = _b[0], setResourceResp = _b[1];
    react_1.useEffect(function () {
        rpcCaller.get(resourceKey).then(setResourceResp);
    }, [resourceKey, rpcCaller, setResourceResp]);
    var actions = react_1.useMemo(function () {
        var updateResourceResp = function (resourceData) {
            return setResourceResp(function (current) { return current && __assign(__assign({}, current), { resourceData: resourceData }); });
        };
        var updateResourceRespForm = function (resourceResp) {
            return resourceResp && updateResourceResp(resourceResp);
        };
        var edit = rpcCaller.edit, get = rpcCaller.get, setIsPublished = rpcCaller.setIsPublished, toggleBookmark = rpcCaller.toggleBookmark, toggleLike = rpcCaller.toggleLike, _delete = rpcCaller._delete;
        return {
            editResource: function (res) {
                return edit(resourceKey, res).then(updateResourceRespForm);
            },
            getResource: function () { return get(resourceKey).then(setResourceResp); },
            deleteResource: function () { return _delete(resourceKey).then(updateResourceResp); },
            toggleBookmark: function () { return toggleBookmark(resourceKey).then(updateResourceResp); },
            toggleLike: function () { return toggleLike(resourceKey).then(updateResourceResp); },
            setIsPublished: function (approve) {
                setIsPublished(resourceKey, approve).then(updateResourceResp);
            }
        };
    }, [resourceKey, rpcCaller]);
    return react_1.useMemo(function () {
        if (!resourceResp || !actions)
            return null;
        return {
            actions: actions,
            props: resourceResp
        };
    }, [actions, resourceResp]);
};
