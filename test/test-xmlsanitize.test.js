import { test, expect } from 'vitest'
import fs from 'fs'
import parser from '../lib'

test('sanitize', () => {
  const expected = fs.readFileSync(__dirname + '/fixtures/xmlsanitize.xml', { encoding: 'utf8' })
  const json = parser.toJson(expected, { object: true })
  const xmlres = parser.toXml(json, { sanitize: true })

  expect(expected).toEqual(xmlres)
})
