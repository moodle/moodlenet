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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var react_1 = require("react");
var getValue = function (obj, field) { return obj[field] ? obj[field].value : null; };
var eventTargetReader = function (eventTarget, fields) {
    return fields.reduce(function (acc, field) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[field] = getValue(eventTarget, field), _a)));
    }, {});
};
var InputLabel = function (_a) {
    var label = _a.label, type = _a.type, placeholder = _a.placeholder, value = _a.value, name = _a.name, others = __rest(_a, ["label", "type", "placeholder", "value", "name"]);
    return (react_1["default"].createElement("label", { style: { display: 'block' } },
        label,
        " \u00A0",
        react_1["default"].createElement("input", __assign({ type: type || 'text', placeholder: placeholder || '', value: value, name: name }, others))));
};
var FormConfig = function (_a) {
    var configDefault = _a.configDefault;
    var _b = react_1["default"].useState(configDefault || {}), config = _b[0], setConfig = _b[1];
    console.log('render form ', configDefault);
    var getValue = function (field) { return config && config[field] ? config[field] : ''; };
    var handleSubmit = function (event) {
        event.preventDefault();
        var formValues = eventTargetReader(event.currentTarget, ['provider', 'apiKey', 'apiSecret', 'other']);
        // setConfig((formValues || {apiKey:''}) as ConfigApiKey)
        //console.log('values', formValues)
        console.log('second ', formValues);
    };
    var handleReset = function (_) { return setConfig(configDefault); };
    return react_1["default"].createElement("div", null,
        react_1["default"].createElement("h3", null, "Config Api Key"),
        react_1["default"].createElement("form", { onSubmit: handleSubmit },
            react_1["default"].createElement(InputLabel, { label: "Provider", type: "text", placeholder: "Provider", value: getValue('provider'), name: "provider" }),
            react_1["default"].createElement(InputLabel, { label: "Api key", type: "text", placeholder: "Api key", value: getValue('apiKey'), name: "apiKey" }),
            react_1["default"].createElement(InputLabel, { label: "Api secret", type: "text", placeholder: "Api secret", value: getValue('apiSecret'), name: "apiSecret" }),
            react_1["default"].createElement(InputLabel, { label: "Other", type: "text", placeholder: "Other", value: getValue('other'), name: "other" }),
            react_1["default"].createElement("button", { type: "submit", style: {} }, "salva"),
            react_1["default"].createElement("button", { onClick: handleReset, style: {} }, "reset")));
};
exports["default"] = FormConfig;
