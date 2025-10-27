import parser from '../lib'

import { expect, describe, it, test, bench } from 'vitest'
import objToXml from '../lib/obj2xml'

const fs = require('fs')

const internals = {}
const { toJson, toXml } = parser


const xmlStr = '<foo attr=\"value\">bar<subnode val=\"test\">glass</subnode></foo>'
const json = toJson(xmlStr, { object: true, reversible: true, textNodeName: '___test' })

bench('xml1', () => {
  const xml = toXml(json, { textNode: '___test' })
})

bench('xml2', () => {
  const xml2 = objToXml({ textNode: '___test' }, json)
})
