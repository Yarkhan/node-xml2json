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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sanitize_js_1 = __importDefault(require("./sanitize.js"));
var makeTag = function (tagName, text, attrs) {
    if (attrs === void 0) { attrs = ''; }
    var _attrs = attrs.length ? ' ' + attrs : '';
    return "<".concat(tagName).concat(_attrs, ">").concat(text, "</").concat(tagName, ">");
};
var defaultOptions = {
    textNode: '$t',
    sanitize: false,
    ignoreNull: false
};
var isObject = function (value) { return typeof value === 'object' && value !== null && !Array.isArray(value); };
var toXml = function (obj, options) {
    if (obj === void 0) { obj = {}; }
    if (options === void 0) { options = {}; }
    var _options = __assign(__assign({}, defaultOptions), options);
    if (typeof obj !== 'object') {
        throw new Error("Expected object. Received ".concat(typeof obj, "\n").concat(obj));
    }
    return Object.entries(obj).map(function (entry) {
        var tagName = entry[0], _value = entry[1];
        var value = _options.ignoreNull ? _value : (_value !== null && _value !== void 0 ? _value : {});
        var children = [];
        var attrs = [];
        if (!isObject(value)) {
            if (_value === null)
                return '';
            throw new Error('malformed value object');
        }
        Object.entries(value).forEach(function (entry) {
            var _key = entry[0], _val = entry[1];
            if (typeof _val === 'object') {
                children.push([_val].flat().map(function (v) {
                    var _a;
                    return toXml((_a = {}, _a[_key] = v, _a), _options);
                }).join(''));
                return;
            }
            if (_key === _options.textNode) {
                children.push(_options.sanitize ? (0, sanitize_js_1.default)(_val) : _val);
                return;
            }
            attrs.push("".concat(_key, "=\"").concat(_options.sanitize ? (0, sanitize_js_1.default)(_val, false, true) : _val, "\""));
        });
        var childrenStr = children.join('');
        var attrsStr = attrs.join(' ');
        return makeTag(tagName, childrenStr, attrsStr);
    }).join('');
};
exports.default = toXml;
