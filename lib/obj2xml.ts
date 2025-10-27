const indent = (lvl = 0) => `  `.repeat(lvl)

const makeTag = (tagName: string, text: string, attrs = '', shouldIndent = false, depth = 0) => {
  const _indent = shouldIndent ? indent : () => ''
  const n = shouldIndent ? '\n' : ''
  const _attrs = attrs.length ? ' '+attrs: ''

  return [
    `<${tagName}${_attrs}>`,
    `${_indent(1)}${text}`,
    `</${tagName}>`,
  ].map(line => {
    if (!text) return line.trim()
    return _indent(depth) + line + n
  })
  .join('')
}

const defaultOptions = {
  textNode: '',
  indent: false,
  depth: 0
}


const isObject = (value: any) => typeof value === 'object' && value !== null && !Array.isArray(value)

const toXml = (options = {}, obj = {}): string => {
  const _options = {...defaultOptions, ...options}  
  
  if (typeof obj !== 'object') {
    throw new Error('malformed input obj')
  }
  
  return Object.entries(obj).map(entry => {
    const [key, value] = entry
    const children: string[] = []
    const attrs:string[] = []
    
    if (!isObject(value)) {
      throw new Error('malforme value object')
    }

    Object.entries(value).forEach(entry => {
      const [_key, _val] = entry
      
      if (typeof _val === 'object') {
        children.push(
          [_val].flat().map(v => toXml(_options, {[_key]: v})).join('')
        )
        return
      }

      if (_key === _options.textNode) {
        children.push(`${_val}`)
        return
      }
      
      attrs.push(`${_key}="${_val}"`)

    })

    const childrenStr = children.join('')
    const attrsStr = attrs.join('')

    return makeTag(key, childrenStr, attrsStr)
  }).join('')

}

export default toXml