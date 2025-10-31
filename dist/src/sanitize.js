"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sanitize;
/**
 * Simple sanitization. It is not intended to sanitize
 * malicious element values.
 *
 * character | escaped
 *      <       &lt;
 *      >       &gt;
 *      (       &#40;
 *      )       &#41;
 *      #       &#35;
 *      &       &amp;
 *      "       &quot;
 *      '       &apos;
 */
// used for body text
var charsEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
var charsUnescape = {
    '&amp;': '&',
    '&#35;': '#',
    '&lt;': '<',
    '&gt;': '>',
    '&#40;': '(',
    '&#41;': ')',
    '&quot;': '"',
    '&apos;': "'",
    '&#31;': '\u001F'
};
// used in attribute values
var charsAttrEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
};
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}
function sanitize(value, reverse, attribute) {
    if (typeof value !== 'string') {
        return value;
    }
    var chars = reverse ? charsUnescape : (attribute ? charsAttrEscape : charsEscape);
    Object.entries(chars).forEach(function (_a) {
        var key = _a[0], val = _a[1];
        value = value.replace(new RegExp(escapeRegExp(key), 'g'), val);
    });
    return value;
}
