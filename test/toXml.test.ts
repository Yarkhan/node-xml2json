import { expect, test } from "vitest"
import toXml from "../lib/obj2xml"

test('new obj', () => {
  const hobbies = {
    cool: 'yes',
    hobby: [
      { id: 1, tools: {tool: [{ tid: 1 }, { tid: 2 }]} },
      { id: 2 },
    ],
    _t: 'fuck'
  }
  // console.log(
  //   toXML2({textNode: '_t'}, {hobbies})
  // )
  // const obj = JSON.parse(
  //   `{"numbers":{"type":"roman","num":[{"id":"1","_t":"I"},{"id":"2","_t":"II"}]}}`
  // )
  // const xml = toXML2({textNode: '_t'}, obj)
  // const expected = `<numbers type="roman"><num id="1">I</num><num id="2">II</num></numbers>`

  console.log(toXml({textNode: '_t'}, {hobbies}))
})