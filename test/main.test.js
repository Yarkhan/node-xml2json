import parser from '../lib'

import { expect, describe, it, test, bench } from 'vitest'
import objToXml from '../lib/obj2xml'

const fs = require('fs')

const internals = {}
const { toJson, toXml } = parser

describe('xml2json', function () {
  it('coerces', function () {
    const xml = internals.readFixture('coerce.xml')
    const result = parser.toJson(xml, { coerce: false })
    const json = internals.readFixture('coerce.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  it('handles domain', function () {
    const xml = internals.readFixture('domain.xml')
    const result = parser.toJson(xml, { coerce: false })
    const json = internals.readFixture('domain.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  it('does large file', function () {
    const xml = internals.readFixture('large.xml')
    const result = parser.toJson(xml, { coerce: false, trim: true })
    const json = internals.readFixture('large.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  it('handles reorder', function () {
    const xml = internals.readFixture('reorder.xml')
    const result = parser.toJson(xml, {})
    const json = internals.readFixture('reorder.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  it('handles text with space', function () {
    const xml = internals.readFixture('spacetext.xml')
    const result = parser.toJson(xml, { coerce: false, trim: false })
    const json = internals.readFixture('spacetext.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  it('does xmlsanitize', function () {
    const xml = internals.readFixture('xmlsanitize.xml')
    const result = parser.toJson(xml)
    const json = internals.readFixture('xmlsanitize.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  it('does xmlsanitize of text', function () {
    const xml = internals.readFixture('xmlsanitize2.xml')
    const result = parser.toJson(xml, { reversible: true })
    const json = internals.readFixture('xmlsanitize2.json')

    expect(result).toEqual(JSON.parse(json))

    return Promise.resolve()
  })

  it('does json unsanitize', function () {
    const json = internals.readFixture('xmlsanitize.json')
    const result = parser.toXml(json, { sanitize: true })
    const xml = internals.readFixture('xmlsanitize.xml')

    expect(result).toEqual(xml)

    return Promise.resolve()
  })

  it('does json unsanitize of text', function () {
    const json = internals.readFixture('xmlsanitize2.json')
    const result = parser.toXml(json, { sanitize: true })
    const xml = internals.readFixture('xmlsanitize2.xml')

    expect(result).toEqual(xml)

    return Promise.resolve()
  })

  it('does doesnt double sanitize', function () {
    const json = internals.readFixture('xmlsanitize3.json')
    const result = parser.toXml(json, { sanitize: true })
    const xml = internals.readFixture('xmlsanitize3.xml')

    expect(result).toEqual(xml)

    return Promise.resolve()
  })

  it('does doesnt double unsanitize', function () {
    const xml = internals.readFixture('xmlsanitize3.xml')
    const result = parser.toJson(xml, { reversible: true })
    const json = internals.readFixture('xmlsanitize3.json')

    expect(result).toEqual(JSON.parse(json))
    return Promise.resolve()
  })

  it('throws error on bad options', function () {
    const throws = function () {
      const result = parser.toJson(undefined, { derp: true })
    }

    expect(throws).toThrow()
    return Promise.resolve()
  })

  describe('alternateTextNode', function () {
    it('A1: defaults without the option being defined', function () {
      const xml = internals.readFixture('alternate-text-node-A.xml')
      const result = parser.toJson(xml, { reversible: true })
      const json = internals.readFixture('alternate-text-node-A.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    it('A2: defaults with option as false', function () {
      const xml = internals.readFixture('alternate-text-node-A.xml')
      const result = parser.toJson(xml, { alternateTextNode: false, reversible: true })
      const json = internals.readFixture('alternate-text-node-A.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    it('B: uses alternate text node with option as true', function () {
      const xml = internals.readFixture('alternate-text-node-A.xml')
      const result = parser.toJson(xml, { textNodeName: '_t', reversible: true })
      const json = internals.readFixture('alternate-text-node-B.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    it('C: overrides text node with option as "xx" string', function () {
      const xml = internals.readFixture('alternate-text-node-A.xml')
      const result = parser.toJson(xml, { textNodeName: 'xx', reversible: true })
      const json = internals.readFixture('alternate-text-node-C.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })

    it('D: double check sanatize and trim', function () {
      const xml = internals.readFixture('alternate-text-node-D.xml')
      const result = parser.toJson(xml, { textNodeName: 'zz', reversible: true })
      const json = internals.readFixture('alternate-text-node-D.json')

      expect(result).toEqual(JSON.parse(json))

      return Promise.resolve()
    })
  })
})

describe('json2xml', function () {
  it('converts domain to json', function () {
    const json = internals.readFixture('domain-reversible.json')
    const result = parser.toXml(json)
    const xml = internals.readFixture('domain.xml')

    expect(result + '\n').toEqual(xml)

    return Promise.resolve()
  })

  describe('ignore null', function () {
    it('ignore null properties {ignoreNull: true}', function () {
      const json = JSON.parse(internals.readFixture('null-properties.json'))
      const expectedXml = internals.readFixture('null-properties-ignored.xml')

      const xml = parser.toXml(json, { ignoreNull: true })
      expect(xml).toEqual(expectedXml)

      return Promise.resolve()
    })

    it('don\'t ignore null properties (default)', function () {
      const json = JSON.parse(internals.readFixture('null-properties.json'))
      const expectedXml = internals.readFixture('null-properties-not-ignored.xml')

      const xml = parser.toXml(json)
      expect(xml).toEqual(expectedXml)

      return Promise.resolve()
    })
  })
})

test('does not lose text nodes', () => {
  const xmlStr = '<foo attr=\"value\">bar<subnode val=\"test\" >glass</subnode></foo>'
  const result = toJson(xmlStr, { object: true, reversible: true })
  const expected = { foo: { attr: 'value', $t: 'bar', subnode: { val: 'test', $t: 'glass' } } }

  expect(result).toMatchObject(expected)
})

test('correctly reverses using alternateTextNode', () => {
  const xmlStr = '<foo attr=\"value\">bar<subnode val=\"test\">glass</subnode></foo>'
  const json = toJson(xmlStr, { object: true, reversible: true, textNodeName: '___test' })
  const xml = toXml(json, { textNode: '___test' })
  expect(xmlStr).toEqual(xml)
})

internals.readFixture = function (file) {
  return fs.readFileSync(__dirname + '/fixtures/' + file, { encoding: 'utf-8' })
}

test('new toxml function', () => {
  const xmlStr = '<foo attr=\"value\">bar<subnode val=\"test\">glass</subnode></foo>'
  const json = toJson(xmlStr, { object: true, reversible: true, textNodeName: '___test' })
  const xml = toXml(json, { textNode: '___test' })
  const xml2 = objToXml({ textNode: '___test' }, json)
  expect(xmlStr).toEqual(xml)
  expect(xmlStr).toEqual(xml2)
})
