import { test, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import toJson from '../src/xml2obj'
import toXml from '../src/obj2xml'

test('sanitize', () => {
  const expected = fs.readFileSync(path.join(__dirname, '/fixtures/xmlsanitize.xml'), { encoding: 'utf8' })
  const json = toJson(expected)
  const xmlres = toXml(json, { sanitize: true })

  expect(expected).toEqual(xmlres)
})
