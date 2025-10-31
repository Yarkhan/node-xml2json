import expat from 'node-expat'

interface toJsonOptions {
  reversible?: boolean
  trim?: boolean
  textNode?: string
}

const defaultOptions = {
  reversible: true,
  trim: true,
  textNode: '$t'
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

  const textNodeName = options.textNode

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

  if (!options.reversible) unwrap(current, options.textNode)

  return root
}

export default toJSON
