import toJson from '../src/xml2json'

import { expect, describe, test } from 'vitest'

import fs from 'fs'
import path from 'path'

const readFixture = (file = '', parseObj = false) => {
  const _file = fs.readFileSync(path.join(__dirname, '/fixtures/', file), { encoding: 'utf-8' })
  if (parseObj) return JSON.parse(_file)
  return _file
}

describe('xml2json', function () {
  test('coerces', function () {
    const xml = readFixture('coerce.xml')
    const result = toJson(xml)
    const json = readFixture('coerce.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  test('handles domain', function () {
    const xml = readFixture('domain.xml')
    const result = toJson(xml)
    const json = readFixture('domain.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  test('does large file', function () {
    const xml = readFixture('large.xml')
    const result = toJson(xml, { trim: true })
    const json = readFixture('large.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  test('handles reorder', function () {
    const xml = readFixture('reorder.xml')
    const result = toJson(xml, {})
    const json = readFixture('reorder.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  test('handles text with space', function () {
    const xml = readFixture('spacetext.xml')
    const result = toJson(xml, { trim: false })
    const json = readFixture('spacetext.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  test('does xmlsanitize', function () {
    const xml = readFixture('xmlsanitize.xml')
    const result = toJson(xml)
    const json = readFixture('xmlsanitize.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  test('does xmlsanitize of text', function () {
    const xml = readFixture('xmlsanitize2.xml')
    const result = toJson(xml, { reversible: true })
    const json = readFixture('xmlsanitize2.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  test('does doesnt double unsanitize', function () {
    const xml = readFixture('xmlsanitize3.xml')
    const result = toJson(xml, { reversible: true })
    const json = readFixture('xmlsanitize3.json')

    expect(result).toEqual(JSON.parse(json))
    return Promise.resolve()
  })

  describe('textNode', function () {
    test('A1: defaults without the option being defined', function () {
      const xml = readFixture('alternate-text-node-A.xml')
      const result = toJson(xml, { reversible: true })
      const json = readFixture('alternate-text-node-A.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    test('A2: defaults with option as false', function () {
      const xml = readFixture('alternate-text-node-A.xml')
      const result = toJson(xml, { reversible: true })
      const json = readFixture('alternate-text-node-A.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    test('B: uses alternate text node with option as true', function () {
      const xml = readFixture('alternate-text-node-A.xml')
      const result = toJson(xml, { textNodeName: '_t', reversible: true })
      const json = readFixture('alternate-text-node-B.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    test('C: overrides text node with option as "xx" string', function () {
      const xml = readFixture('alternate-text-node-A.xml')
      const result = toJson(xml, { textNodeName: 'xx', reversible: true })
      const json = readFixture('alternate-text-node-C.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    test('D: double check sanatize and trim', function () {
      const xml = readFixture('alternate-text-node-D.xml')
      const result = toJson(xml, { textNodeName: 'zz', reversible: true })
      const json = readFixture('alternate-text-node-D.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })
  })
})

test('does not lose text nodes', () => {
  const xmlStr = '<foo attr=\"value\">bar<subnode val=\"test\" >glass</subnode></foo>'
  const result = toJson(xmlStr, { reversible: true })
  const expected = { foo: { attr: 'value', $t: 'bar', subnode: { val: 'test', $t: 'glass' } } }

  expect(result).toMatchObject(expected)
})
