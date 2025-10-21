const sanitizer = require('./sanitize.js')

module.exports = function (json, options) {
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
  const toXml = new ToXml(options)
  toXml.parse(obj)
  return toXml.xml
}

ToXml.prototype.parse = function (obj) {
  if (!obj) return

  const self = this
  const keys = Object.keys(obj)
  const len = keys.length

  // First pass, extract strings only
  for (var i = 0; i < len; i++) {
    var key = keys[i]; const value = obj[key]; const isArray = Array.isArray(value)
    const type = typeof (value)
    if (type == 'string' || type == 'number' || type == 'boolean' || isArray) {
      const it = isArray ? value : [value]

      it.forEach(function (subVal) {
        if (typeof (subVal) !== 'object') {
          if (key === self.options.textNode) {
            self.addTextContent(subVal)
          } else {
            self.addAttr(key, subVal)
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
          self.openTag(key)
          self.parse(elem)
          self.closeTag(key)
        }
      }
    } else if (typeof (obj[key]) === 'object' && !(self.options.ignoreNull && obj[key] === null)) {
      self.openTag(key)
      self.parse(obj[key])
      self.closeTag(key)
    }
  }
}

ToXml.prototype.openTag = function (key) {
  this.completeTag()
  this.xml += '<' + key
  this.tagIncomplete = true
}
ToXml.prototype.addAttr = function (key, val) {
  if (this.options.sanitize) {
    val = sanitizer.sanitize(val, false, true)
  }
  this.xml += ' ' + key + '="' + val + '"'
}
ToXml.prototype.addTextContent = function (text) {
  this.completeTag()
  const newText = (this.options.sanitize ? sanitizer.sanitize(text) : text)
  this.xml += newText
}
ToXml.prototype.closeTag = function (key) {
  this.completeTag()
  this.xml += '</' + key + '>'
}
ToXml.prototype.completeTag = function () {
  if (this.tagIncomplete) {
    this.xml += '>'
    this.tagIncomplete = false
  }
}
function ToXml (options) {
  const defaultOpts = {
    sanitize: false,
    ignoreNull: false,
    textNode: '$t'
  }

  this.options = {
    ...defaultOpts,
    ...options
  }

  this.xml = ''
  this.tagIncomplete = false
}
