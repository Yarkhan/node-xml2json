import expat from 'node-expat'

const onStartElement = (state: { options?: { reversible: boolean; trim: boolean; textNodeName: string }; currentElementName: any; currentObject: any; ancestors: any }, name: string | number, attrs: any) => {
  const currentObject = state.currentObject
  state.currentElementName = name

  if (!currentObject[name]) {
    currentObject[name] = attrs
  } else {
    if (!Array.isArray(currentObject[name])) {
      currentObject[name] = [currentObject[name]]
    }
    currentObject[name].push(attrs)
  }

  // Store the current (old) parent.
  state.ancestors.push(currentObject)

  state.currentObject = Array.isArray(currentObject[name])
    ? currentObject[name].at(-1)
    : currentObject[name]
}

const onText = (data: any, state: { options: any; currentElementName?: null; currentObject: any; ancestors?: never[] }) => {
  const { currentObject, options: { textNodeName } } = state
  currentObject[textNodeName] = (currentObject[textNodeName] || '') + data
}

const onEndElement = (state: { options: any; currentElementName?: any; currentObject: any; ancestors?: any }, name: string | number) => {
  const { currentObject, options: { textNodeName } } = state

  if (currentObject[textNodeName]) {
    if (state.options.trim) {
      state.currentObject[textNodeName] = currentObject[textNodeName].trim()
    }
  }

  if (state.currentElementName !== name) {
    const current = currentObject[state.options.textNodeName]
    if (current === undefined || state.currentObject[state.options.textNodeName].trim() === '') {
      delete state.currentObject[state.options.textNodeName]
    }
  }

  const ancestor = state.ancestors.pop()

  if (!state.options.reversible) {
    if ((state.options.textNodeName in state.currentObject) && (Object.keys(state.currentObject).length === 1)) {
      if (Array.isArray(ancestor[name])) {
        ancestor[name].push(ancestor[name].pop()[state.options.textNodeName])
      } else {
        ancestor[name] = state.currentObject[state.options.textNodeName]
      }
    }
  }

  state.currentObject = ancestor
}

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

const toJSON = (xml = '', _options: toJsonOptions = {}) => {
  _options = _options || {}
  const parser = new expat.Parser('UTF-8')

  const state = {
    options: {
      ...defaultOptions,
      ..._options
    },
    currentElementName: null,
    currentObject: {},
    ancestors: []
  }

  parser.on('startElement', (name, args) => onStartElement(state, name, args))
  parser.on('text', data => onText(data, state))
  parser.on('endElement', (name) => onEndElement(state, name))

  if (!parser.parse(xml)) {
    throw new Error('There are errors in your xml file: ' + parser.getError())
  }

  return state.currentObject
}

export default toJSON
