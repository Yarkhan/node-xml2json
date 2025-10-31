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
const charsEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
}

const charsUnescape = {
  '&amp;': '&',
  '&#35;': '#',
  '&lt;': '<',
  '&gt;': '>',
  '&#40;': '(',
  '&#41;': ')',
  '&quot;': '"',
  '&apos;': "'",
  '&#31;': '\u001F'
}

// used in attribute values
const charsAttrEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
}

function escapeRegExp (string: string) {
  return string.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
}

export default function sanitize (value: any, reverse?: any, attribute?: any) {
  if (typeof value !== 'string') {
    return value
  }

  const chars = reverse ? charsUnescape : (attribute ? charsAttrEscape : charsEscape)

  Object.entries(chars).forEach(([key, val]) => {
    value = value.replace(new RegExp(escapeRegExp(key), 'g'), val)
  })

  return value
}
