import sanitizer from './sanitize.js'

const openTag = (key, state) => {
  completeTag(state)
  state.xml += '<' + key
  state.tagIncomplete = true
}

const addAttr = (key, val, state) => {
  if (state.options.sanitize) {
    val = sanitizer.sanitize(val, false, true)
  }
  state.xml += ' ' + key + '="' + val + '"'
}

const addTextContent = (text, state) => {
  completeTag(state)
  const newText = (state.options.sanitize ? sanitizer.sanitize(text) : text)
  state.xml += newText
}
const closeTag = (key, state) => {
  completeTag(state)
  state.xml += '</' + key + '>'
}

const completeTag = (state) => {
  if (state.tagIncomplete) {
    state.xml += '>'
    state.tagIncomplete = false
  }
}

const parse = (obj, state) => {
  if (!obj) return

  const self = state
  const keys = Object.keys(obj)
  const len = keys.length

  // First pass, extract strings only
  for (var i = 0; i < len; i++) {
    var key = keys[i]
    const value = obj[key]
    const isArray = Array.isArray(value)
    const type = typeof (value)
    if (type == 'string' || type == 'number' || type == 'boolean' || isArray) {
      const it = isArray ? value : [value]

      it.forEach(function (subVal) {
        if (typeof (subVal) !== 'object') {
          if (key === self.options.textNode) {
            addTextContent(subVal, state)
          } else {
            addAttr(key, subVal, state)
          }
        }
      })
    }
  }

  // Second path, now handle sub-objects and arrays
  for (var i = 0; i < len; i++) {
    var key = keys[i]

    if (Array.isArray(obj[key])) {
      const elems = obj[key]
      const l = elems.length
      for (let j = 0; j < l; j++) {
        const elem = elems[j]

        if (typeof (elem) === 'object') {
          openTag(key, state)
          parse(elem, state)
          closeTag(key, state)
        }
      }
    } else if (typeof (obj[key]) === 'object' && !(self.options.ignoreNull && obj[key] === null)) {
      openTag(key, state)
      parse(obj[key], state)
      closeTag(key, state)
    }
  }
}

export default function (json, options) {
  if (json instanceof Buffer) {
    json = json.toString()
  }

  let obj = null
  if (typeof (json) === 'string') {
    try {
      obj = JSON.parse(json)
    } catch (e) {
      throw new Error('The JSON structure is invalid')
    }
  } else {
    obj = json
  }

  const defaultOpts = {
    sanitize: false,
    ignoreNull: false,
    textNode: '$t'
  }

  const _options = {
    ...defaultOpts,
    ...options
  }

  const state = {
    options: _options,
    xml: '',
    tagIncomplete: ''
  }
  parse(obj, state)
  return state.xml
}
