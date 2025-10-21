import { test, expect } from 'vitest'

import fs from 'fs'
import parser from '../lib'

const data = fs.readFileSync('./test/fixtures/reorder.json')
const result = parser.toXml(data)

let expected = fs.readFileSync('./test/fixtures/reorder.xml') + ''

if (expected) {
  expected = expected.trim()
}

test('reorder', () => {
  expect(result).toEqual(expected)
})
