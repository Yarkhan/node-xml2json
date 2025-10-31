# XML to Obj
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/buglabs/node-xml2json?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/buglabs/node-xml2json.svg?branch=master)](https://travis-ci.org/buglabs/node-xml2json)

It does not parse the following elements:

* CDATA sections (*)
* Processing instructions
* XML declarations
* Entity declarations
* Comments

This module uses node-expat which will require extra steps if you want to get it installed on Windows. Please
refer to its [documentation](https://github.com/astro/node-expat/blob/master/README.md#windows).

## Installation
```
$ npm install xml2json
```

## Usage
```javascript
var parser = require('xml2json');

var xml = "<foo attr=\"value\">bar</foo>";
console.log("input -> %s", xml)

// xml to json
var json = parser.toJson(xml);
console.log("to json -> %s", json);

// json to xml
var xml = parser.toXml(json);
console.log("back to xml -> %s", xml)
```

## API

```javascript
parser.toJson(xml, options);
```
```javascript
parser.toXml(json);
```

### Options object for `toJson`

Default values:
```javascript
var options = {
    reversible: true,
    trim: true,
    textNode: '$t'
};
```

* **object:** Returns a Javascript object instead of a JSON string
* **reversible:** Makes the JSON reversible to XML (*)
* **coerce:** Makes type coercion. i.e.: numbers and booleans present in attributes and element values are converted from string to its correspondent data types. Coerce can be optionally defined as an object with specific methods of coercion based on attribute name or tag name, with fallback to default coercion.
* **trim:** Removes leading and trailing whitespaces as well as line terminators in element values.
* **arrayNotation:** XML child nodes are always treated as arrays NB: you can specify a selective array of nodes for this to apply to instead of the whole document. 
* **sanitize:** Sanitizes the following characters present in element values:

```javascript
var chars =  {
    '<': '&lt;',
    '>': '&gt;',
    '(': '&#40;',
    ')': '&#41;',
    '#': '&#35;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
};
```
* **alternateTextNode:** Changes the default textNode property from $t to _t when option is set to true. Alternatively a string can be specified which will override $t to what ever the string is.


### Options object for `toXml`

Default values:
```javascript
var options = {
    sanitize: false,
    ignoreNull: false
};
```

* `sanitize: false` is the default option to behave like previous versions
* **ignoreNull:** Ignores all null values


(*) xml2json tranforms CDATA content to JSON, but it doesn't generate a reversible structure.