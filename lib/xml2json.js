const expat = require('node-expat')

function startElement (state, name, attrs) {
  state.currentElementName = name

  if (!(name in state.currentObject)) {
    state.currentObject[name] = attrs
  } else if (!(state.currentObject[name] instanceof Array)) {
    // Put the existing object in an array.
    const newArray = [state.currentObject[name]]
    // Add the new object to the array.
    newArray.push(attrs)
    // Point to the new array.
    state.currentObject[name] = newArray
  } else {
    // An array already exists, push the attributes on to it.
    state.currentObject[name].push(attrs)
  }

  // Store the current (old) parent.
  state.ancestors.push(state.currentObject)

  // We are now working with this object, so it becomes the current parent.
  if (state.currentObject[name] instanceof Array) {
    // If it is an array, get the last element of the array.
    state.currentObject = state.currentObject[name][state.currentObject[name].length - 1]
  } else {
    // Otherwise, use the object itself.
    state.currentObject = state.currentObject[name]
  }
}

function text (data, state) {
  state.currentObject[textNodeName(state)] = (state.currentObject[textNodeName(state)] || '') + data
}

function endElement (state, name) {
  if (state.currentObject[textNodeName(state)]) {
    if (state.options.trim) {
      state.currentObject[textNodeName(state)] = state.currentObject[textNodeName(state)].trim()
    }
    state.currentObject[textNodeName(state)] = state.currentObject[textNodeName(state)]
  }

  if (state.currentElementName !== name) {
    const current = state.currentObject[textNodeName(state)]
    if (current === undefined || state.currentObject[textNodeName(state)].trim() === '') {
      delete state.currentObject[textNodeName(state)]
    }
  }

  // This should check to make sure that the name we're ending
  // matches the name we started on.
  const ancestor = state.ancestors.pop()
  if (!state.options.reversible) {
    if ((textNodeName(state) in state.currentObject) && (Object.keys(state.currentObject).length === 1)) {
      if (ancestor[name] instanceof Array) {
        ancestor[name].push(ancestor[name].pop()[textNodeName(state)])
      } else {
        ancestor[name] = state.currentObject[textNodeName(state)]
      }
    }
  }

  state.currentObject = ancestor
}

function textNodeName (state) {
  return state.options.alternateTextNode ? typeof state.options.alternateTextNode === 'string' ? state.options.alternateTextNode : '_t' : '$t'
}

/**
 * Parses xml to json using node-expat.
 * @param {String|Buffer} xml The xml to be parsed to json.
 * @param {Object} _options An object with options provided by the user.
 * The available options are:
 *  - object: If true, the parser returns a Javascript object instead of
 *            a JSON string.
 *  - reversible: If true, the parser generates a reversible JSON, mainly
 *                characterized by the presence of the property $t.
 *  - sanitize_values: If true, the parser escapes any element value in the xml
 * that has any of the following characters: <, >, (, ), #, #, &, ", '.
 *  - alternateTextNode (boolean OR string):
 *      If false or not specified: default of $t is used
 *      If true, whenever $t is returned as an end point, is is substituted with _t
 *      it String, whenever $t is returned as an end point, is is substituted with the String value (care advised)
 *
 * @return {String|Object} A String or an Object with the JSON representation
 * of the XML.
 */

const defaultOptions = {
  reversible: false,
  trim: true,
  alternateTextNode: false
}

module.exports = function (xml, _options = defaultOptions) {
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

  parser.on('startElement', (name, args) => startElement(state, name, args))
  parser.on('text', data => text(data, state))
  parser.on('endElement', (name) => endElement(state, name))

  if (!parser.parse(xml)) {
    throw new Error('There are errors in your xml file: ' + parser.getError())
  }

  return state.currentObject
}
