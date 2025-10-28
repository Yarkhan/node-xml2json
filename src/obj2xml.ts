import sanitizer from './sanitize.js'

const makeTag = (tagName: string, text: string, attrs = '') => {
  const _attrs = attrs.length ? ' '+attrs: ''
  return `<${tagName}${_attrs}>${text}</${tagName}>`
}

const defaultOptions = {
  textNode: '$t',
  sanitize: false,
  ignoreNull: false
}

const isObject = (value: any) => typeof value === 'object' && value !== null && !Array.isArray(value)

const toXml = (obj = {}, options = {}): string => {
  const _options = {...defaultOptions, ...options}  
  
  if (typeof obj !== 'object') {
    throw new Error(`Expected object. Received ${typeof obj}\n${obj}`)
  }
  
  return Object.entries(obj).map(entry => {
    const [tagName, _value] = entry
    const value = _options.ignoreNull ?  _value : (_value ?? {}) 
    const children: string[] = []
    const attrs:string[] = []
    
    if (!isObject(value)) {
      if (_value === null) return ''
      throw new Error('malformed value object')
    }

    Object.entries(value).forEach(entry => {
      const [_key, _val] = entry

      if (typeof _val === 'object') {
        children.push([_val].flat().map(v => toXml({[_key]: v}, _options)).join(''))
        return
      }

      if (_key === _options.textNode) {
        children.push(_options.sanitize ? sanitizer.sanitize(_val) : _val)
        return
      }
      
      attrs.push(
        `${_key}="${_options.sanitize ? sanitizer.sanitize(_val, false, true) : _val}"`
      )

    })

    const childrenStr = children.join('')
    const attrsStr = attrs.join(' ')

    return makeTag(tagName, childrenStr, attrsStr)
  }).join('')

}

export default toXml