var fs = require('fs');
var parser = require('../lib');

var data = fs.readFileSync('./test/fixtures/reorder.json');
var result = parser.toXml(data);

var expected = fs.readFileSync('./test/fixtures/reorder.xml') + '';

var { test, expect } = require('@jest/globals')

if (expected) {
    expected = expected.trim();
}

test('reorder', () => {
  expect(result).toEqual(expected)
})