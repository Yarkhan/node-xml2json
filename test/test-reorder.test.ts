import { test, expect } from 'vitest'

import fs from 'fs'
import toXml from '../src/obj2xml'

const data = JSON.parse(fs.readFileSync('./test/fixtures/reorder.json', 'utf-8'))
const result = toXml(data)

let expected = fs.readFileSync('./test/fixtures/reorder.xml') + ''

if (expected) {
  expected = expected.trim()
}

test('reorder', () => {
  expect(result).toEqual(expected)
})
