const fs = require('fs')
const parser = require('../src')

const file = __dirname + '/fixtures/large.xml'

const data = fs.readFileSync(file)

// With coercion
var t0 = Date.now()
for (var i = 0; i < 100; i++) {
  var result = parser.toJson(data, { reversible: true, coerce: true, object: true })
}
console.log(Date.now() - t0)

// Without coercion
var t0 = Date.now()
for (var i = 0; i < 100; i++) {
  result = parser.toJson(data, { reversible: true, object: true })
}
console.log(Date.now() - t0)
