const expat = require('node-expat')

function startElement (name, attrs, state) {
  currentElementName = name
  if (state.options.coerce) {
    // Looping here in stead of making coerce generic as object walk is unnecessary
    for (const key in attrs) {
      attrs[key] = coerce(attrs[key], key, state)
    }
  }

  if (!(name in currentObject)) {
    if (state.options.arrayNotation || state.options.forceArrays[name]) {
      currentObject[name] = [attrs]
    } else {
      currentObject[name] = attrs
    }
  } else if (!(currentObject[name] instanceof Array)) {
    // Put the existing object in an array.
    const newArray = [currentObject[name]]
    // Add the new object to the array.
    newArray.push(attrs)
    // Point to the new array.
    currentObject[name] = newArray
  } else {
    // An array already exists, push the attributes on to it.
    currentObject[name].push(attrs)
  }

  // Store the current (old) parent.
  ancestors.push(currentObject)

  // We are now working with this object, so it becomes the current parent.
  if (currentObject[name] instanceof Array) {
    // If it is an array, get the last element of the array.
    currentObject = currentObject[name][currentObject[name].length - 1]
  } else {
    // Otherwise, use the object itself.
    currentObject = currentObject[name]
  }
}

function text (data, state) {
  currentObject[textNodeName(state)] = (currentObject[textNodeName(state)] || '') + data
}

function endElement (name, state) {
  if (currentObject[textNodeName(state)]) {
    if (state.options.trim) {
      currentObject[textNodeName(state)] = currentObject[textNodeName(state)].trim()
    }
    currentObject[textNodeName(state)] = coerce(currentObject[textNodeName(state)], name, state)
  }

  if (currentElementName !== name) {
    const current = currentObject[textNodeName(state)]
    if (current === undefined || currentObject[textNodeName(state)].trim() === '') {
      delete currentObject[textNodeName(state)]
    }
  }

  // This should check to make sure that the name we're ending
  // matches the name we started on.
  const ancestor = ancestors.pop()
  if (!state.options.reversible) {
    if ((textNodeName(state) in currentObject) && (Object.keys(currentObject).length == 1)) {
      if (ancestor[name] instanceof Array) {
        ancestor[name].push(ancestor[name].pop()[textNodeName(state)])
      } else {
        ancestor[name] = currentObject[textNodeName(state)]
      }
    }
  }

  currentObject = ancestor
}

function coerce (value, key, state) {
  if (!state.options.coerce || value.trim() === '') {
    return value
  }

  if (typeof state.options.coerce[key] === 'function') { return state.options.coerce[key](value) }

  const num = Number(value)
  if (!isNaN(num)) {
    return num
  }

  const _value = value.toLowerCase()

  if (_value == 'true') {
    return true
  }

  if (_value == 'false') {
    return false
  }

  return value
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
  object: false,
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: false,
  forceArrays: {}
}

module.exports = function (xml, _options = defaultOptions) {
  _options = _options || {}
  const parser = new expat.Parser('UTF-8')

  const state = {
    options: {
      ...defaultOptions,
      ..._options
    }
  }

  parser.on('startElement', (name, args) => startElement(name, args, state))
  parser.on('text', data => text(data, state))
  parser.on('endElement', (name) => endElement(name, state))

  obj = currentObject = {}
  ancestors = []
  currentElementName = null

  if (Array.isArray(state.options.arrayNotation)) {
    state.options.arrayNotation.forEach(function (i) {
      state.options.forceArrays[i] = true
    })
    state.options.arrayNotation = false
  }
  if (!parser.parse(xml)) {
    throw new Error('There are errors in your xml file: ' + parser.getError())
  }

  if (state.options.object) {
    return obj
  }

  let json = JSON.stringify(obj)

  // See: http://timelessrepo.com/json-isnt-a-javascript-subset
  json = json.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')

  return json
}
