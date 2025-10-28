import { test, expect } from 'vitest'
import fs from 'fs'
import parser from '../lib'
import path from 'path'

test('sanitize', () => {
  const expected = fs.readFileSync(path.join(__dirname, '/fixtures/xmlsanitize.xml'), { encoding: 'utf8' })
  const json = parser.toJson(expected)
  const xmlres = parser.toXml(json, { sanitize: true })

  expect(expected).toEqual(xmlres)
})
