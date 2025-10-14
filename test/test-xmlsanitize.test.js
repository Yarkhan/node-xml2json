var fs = require('fs');
var parser = require('../lib');
var { test, expect } = require('@jest/globals')

test('sanitize', () => {
  
  var expected = fs.readFileSync(__dirname + '/fixtures/xmlsanitize.xml', {encoding: 'utf8'});
  var json = parser.toJson(expected, {object: true });
  var xmlres = parser.toXml(json, { sanitize: true });
  
  expect(expected).toEqual(xmlres)
  
})
