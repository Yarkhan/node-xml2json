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
var node_expat_1 = __importDefault(require("node-expat"));
var defaultOptions = {
    reversible: true,
    trim: true,
    textNode: '$t'
};
function unwrap(obj, key) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (!Array.isArray(obj) && Object.keys(obj).length === 1 && key in obj) {
        return unwrap(obj[key], key);
    }
    if (Array.isArray(obj)) {
        return obj.map(function (item) { return unwrap(item, key); });
    }
    for (var _key in obj) {
        if (typeof obj[_key] === 'object') {
            obj[_key] = unwrap(obj[_key], key);
        }
    }
    return obj;
}
var toJson = function (xml, _options) {
    if (xml === void 0) { xml = ''; }
    if (_options === void 0) { _options = {}; }
    _options = _options || {};
    var parser = new node_expat_1.default.Parser('UTF-8');
    var options = __assign(__assign({}, defaultOptions), _options);
    var textNodeName = options.textNode;
    var root = {};
    var stack = [];
    var current = root;
    parser.on('startElement', function (name, attrs) {
        if (!(name in current)) {
            current[name] = attrs;
        }
        else {
            if (!Array.isArray(current[name])) {
                current[name] = [current[name]];
            }
            current[name].push(attrs);
        }
        stack.push({ parent: current, name: name });
        current = attrs;
    });
    parser.on('text', function (data) {
        current[textNodeName] = (current[textNodeName] || '') + data;
    });
    parser.on('endElement', function (name) {
        var _a, _b;
        if (textNodeName in current && options.trim) {
            current[textNodeName] = current[textNodeName].trim();
        }
        var isEmpty = ((_a = current[textNodeName]) === null || _a === void 0 ? void 0 : _a.trim()) === '';
        var hasChildren = Object.keys(current).some(function (key) {
            if (key === textNodeName)
                return false;
            var v = current[key];
            return typeof v === 'object' && v !== null;
        });
        if (isEmpty && hasChildren)
            delete current[textNodeName];
        current = (_b = stack.pop()) === null || _b === void 0 ? void 0 : _b.parent;
    });
    if (!parser.parse(xml)) {
        throw new Error('There are errors in your xml file: ' + parser.getError());
    }
    if (!options.reversible)
        unwrap(current, options.textNode);
    return root;
};
exports.default = toJson;
