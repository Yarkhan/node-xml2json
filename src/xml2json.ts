import expat from 'node-expat'

/**
 * Parses xml to json using node-expat.
 * @param {String|Buffer} xml The xml to be parsed to json.
 * @param {Object} _options An object with options provided by the user.
 * The available options are:
 *  - reversible: If true, the parser generates a reversible JSON, mainly
 *                characterized by the presence of the property $t.
 *  - textNodeName: defaults to $t.
 *
 * @return {String|Object} A String or an Object with the JSON representation
 * of the XML.
 */

const defaultOptions = {
  reversible: false,
  trim: true,
  textNodeName: '$t'
}

interface toJsonOptions {
  reversible?: boolean
  trim?: boolean
  textNodeName?: string
}

function unwrap (obj: any, key: string): any {
  if (obj === null || typeof obj !== 'object') return obj

  if (!Array.isArray(obj) && Object.keys(obj).length === 1 && key in obj) {
    return unwrap(obj[key], key)
  }

  if (Array.isArray(obj)) {
    return obj.map(item => unwrap(item, key))
  }

  for (const _key in obj) {
    if (typeof obj[_key] === 'object') {
      obj[_key] = unwrap(obj[_key], key)
    }
  }
  return obj
}

const toJSON = (xml = '', _options: toJsonOptions = {}) => {
  _options = _options || {}

  const parser = new expat.Parser('UTF-8')

  const options = {
    ...defaultOptions,
    ..._options
  }

  const textNodeName = options.textNodeName

  const root:any = {}

  const stack = [] as { parent: any, name: string }[]

  let current = root

  parser.on('startElement', (name, attrs: any) => {
    if (!(name in current)) {
      current[name] = attrs
    } else {
      if (!Array.isArray(current[name])) {
        current[name] = [current[name]]
      }
      current[name].push(attrs)
    }

    stack.push({ parent: current, name })

    current = attrs
  })

  parser.on('text', data => {
    current[textNodeName] = (current[textNodeName] || '') + data
  })

  parser.on('endElement', (name) => {
    if (textNodeName in current && options.trim) {
      current[textNodeName] = current[textNodeName].trim()
    }

    const isEmpty = current[textNodeName]?.trim() === ''

    const hasChildren = Object.keys(current).some(key => {
      if (key === textNodeName) return false
      const v = current[key]
      return typeof v === 'object' && v !== null
    })

    if (isEmpty && hasChildren) delete current[textNodeName]

    current = stack.pop()?.parent
  })

  if (!parser.parse(xml)) {
    throw new Error('There are errors in your xml file: ' + parser.getError())
  }

  if (!options.reversible) unwrap(current, options.textNodeName)

  return root
}

export default toJSON
