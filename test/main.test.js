var fs = require('fs');
var parser = require(__dirname + '/../lib');

var internals = {};

var {expect} = require('@jest/globals')

describe('xml2json', function () {

    it('converts with array-notation', function () {

        var xml = internals.readFixture('array-notation.xml');
        var result = parser.toJson(xml, { arrayNotation: true });
        var json = internals.readFixture('array-notation.json');

        expect(result).toEqual(json);

        return Promise.resolve();
    });

    it('coerces', function () {

        var xml = internals.readFixture('coerce.xml');
        var result = parser.toJson(xml, { coerce: false });
        var json = internals.readFixture('coerce.json');

        expect(result + '\n').toEqual(json);

        return Promise.resolve();
    });

    it('handles domain', function () {

        var xml = internals.readFixture('domain.xml');
        var result = parser.toJson(xml, { coerce: false });
        var json = internals.readFixture('domain.json');

        expect(result + '\n').toEqual(json);

        return Promise.resolve();
    });

    it('does large file', function () {

        var xml = internals.readFixture('large.xml');
        var result = parser.toJson(xml, { coerce: false, trim: true, sanitize: false });
        var json = internals.readFixture('large.json');

        expect(result + '\n').toEqual(json);

        return Promise.resolve();
    });

    it('handles reorder', function () {

        var xml = internals.readFixture('reorder.xml');
        var result = parser.toJson(xml, {});
        var json = internals.readFixture('reorder.json');

        expect(result).toEqual(json);

        return Promise.resolve();
    });

    it('handles text with space', function () {

        var xml = internals.readFixture('spacetext.xml');
        var result = parser.toJson(xml, { coerce: false, trim: false });
        var json = internals.readFixture('spacetext.json');

        expect(result).toEqual(json);

        return Promise.resolve();
    });

    it('does xmlsanitize', function () {

        var xml = internals.readFixture('xmlsanitize.xml');
        var result = parser.toJson(xml, {sanitize: true});
        var json = internals.readFixture('xmlsanitize.json');

        expect(result).toEqual(json);

        return Promise.resolve();
    });

    it('does xmlsanitize of text', function () {

        var xml = internals.readFixture('xmlsanitize2.xml');
        var result = parser.toJson(xml, {sanitize: true, reversible: true});
        var json = internals.readFixture('xmlsanitize2.json');

        expect(result).toEqual(json);

        return Promise.resolve();
    });

    it('does json unsanitize', function () {

        var json = internals.readFixture('xmlsanitize.json');
        var result = parser.toXml(json, {sanitize: true});
        var xml = internals.readFixture('xmlsanitize.xml');

        expect(result).toEqual(xml);

        return Promise.resolve();
    });

    it('does json unsanitize of text', function () {

        var json = internals.readFixture('xmlsanitize2.json');
        var result = parser.toXml(json, {sanitize: true});
        var xml = internals.readFixture('xmlsanitize2.xml');

        expect(result).toEqual(xml);

        return Promise.resolve();
    });

    it('does doesnt double sanitize', function () {

        var json = internals.readFixture('xmlsanitize3.json');
        var result = parser.toXml(json, {sanitize: true});
        var xml = internals.readFixture('xmlsanitize3.xml');

        expect(result).toEqual(xml);

        return Promise.resolve();
    });

    it('does doesnt double unsanitize', function () {

        var xml = internals.readFixture('xmlsanitize3.xml');
        var result = parser.toJson(xml, {sanitize: true, reversible: true});
        var json = internals.readFixture('xmlsanitize3.json');

        expect(result).toEqual(json);
        return Promise.resolve();
    });

    it('converts with forceArrays', function() {
        var xml = internals.readFixture('forceArray.xml');
        var result = parser.toJson(xml, {arrayNotation: ['drivers', 'vehicles']});
        var json = internals.readFixture('forceArray.json');

        expect(result).toEqual(json);
        return Promise.resolve();
    });

    it('throws error on bad options', function () {

        var throws = function() {

            var result = parser.toJson(xml, { derp: true});
        };

        expect(throws).toThrow();
        return Promise.resolve();
    });

    describe('coercion', function () {

        var file = __dirname + '/fixtures/coerce.xml';
        var data = fs.readFileSync(file);

        it('works with coercion', function() {

            // With coercion
            var result = parser.toJson(data, {reversible: true, coerce: true, object: true});
            expect(result.itemRecord.value[0].longValue['$t']).toEqual(12345);
            expect(result.itemRecord.value[1].stringValue.number).toEqual(false);
            expect(result.itemRecord.value[2].moneyValue.number).toEqual(true);
            expect(result.itemRecord.value[2].moneyValue['$t']).toEqual(104.95);
            expect(result.itemRecord.value[2].moneyValue.text).toEqual(123.45);
            expect(result.itemRecord.value[8].text['$t']).toEqual(42.42);
            return Promise.resolve();
        });

        it('works without coercion', function() {

            var result = parser.toJson(data, {reversible: true, coerce: false, object: true});
            expect(result.itemRecord.value[0].longValue['$t']).toEqual('12345');
            expect(result.itemRecord.value[1].stringValue.number).toEqual('false');
            expect(result.itemRecord.value[2].moneyValue.number).toEqual('true');
            expect(result.itemRecord.value[2].moneyValue['$t']).toEqual('104.95');
            expect(result.itemRecord.value[2].moneyValue.text).toEqual('123.45');
            expect(result.itemRecord.value[8].text['$t']).toEqual('42.42');
            return Promise.resolve();
        });

        it('works with coercion as an optional object', function() {

            var result = parser.toJson(data, {reversible: true, coerce: {text:String}, object: true});
            expect(result.itemRecord.value[0].longValue['$t']).toEqual(12345);
            expect(result.itemRecord.value[1].stringValue.number).toEqual(false);
            expect(result.itemRecord.value[2].moneyValue.number).toEqual(true);
            expect(result.itemRecord.value[2].moneyValue['$t']).toEqual(104.95);
            expect(result.itemRecord.value[2].moneyValue.text).toEqual('123.45');
            expect(result.itemRecord.value[8].text['$t']).toEqual('42.42');
            return Promise.resolve();
        });
    })

    describe('alternateTextNode', function () {

        it('A1: defaults without the option being defined', function() {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {reversible: true});
            var json = internals.readFixture('alternate-text-node-A.json');

            expect(result).toEqual(json);

            return Promise.resolve();
        });

        it('A2: defaults with option as false', function() {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {alternateTextNode: false, reversible: true});
            var json = internals.readFixture('alternate-text-node-A.json');

            expect(result).toEqual(json);

            return Promise.resolve();
        });


        it('B: uses alternate text node with option as true', function() {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {alternateTextNode: true, reversible: true});
            var json = internals.readFixture('alternate-text-node-B.json');

            expect(result).toEqual(json);

            return Promise.resolve();
        });

        it('C: overrides text node with option as "xx" string', function() {

            var xml = internals.readFixture('alternate-text-node-A.xml');
            var result = parser.toJson(xml, {alternateTextNode: "xx", reversible: true});
            var json = internals.readFixture('alternate-text-node-C.json');

            expect(result).toEqual(json);

            return Promise.resolve();
        });

        it('D: double check sanatize and trim', function () {

            var xml = internals.readFixture('alternate-text-node-D.xml');
            var result = parser.toJson(xml, {alternateTextNode: "zz", sanitize: true, trim: true, reversible: true});
            var json = internals.readFixture('alternate-text-node-D.json');

            expect(result).toEqual(json);

            return Promise.resolve();
        });

    })
});


describe('json2xml', function () {

    it('converts domain to json', function () {

        var json = internals.readFixture('domain-reversible.json');
        var result = parser.toXml(json);
        var xml = internals.readFixture('domain.xml');

        expect(result+'\n').toEqual(xml);

        return Promise.resolve();
    });

    it('works with array notation', function () {

        var xml = internals.readFixture('array-notation.xml');
        var expectedJson = JSON.parse( internals.readFixture('array-notation.json') );

        var json = parser.toJson(xml, {object: true, arrayNotation: true});

        expect(json).toEqual(expectedJson);

        return Promise.resolve();
    });

    describe('ignore null', function () {

        it('ignore null properties {ignoreNull: true}', function () {

            var json = JSON.parse( internals.readFixture('null-properties.json') );
            var expectedXml = internals.readFixture('null-properties-ignored.xml');

            var xml = parser.toXml(json, {ignoreNull: true});
            expect(xml).toEqual(expectedXml);

            return Promise.resolve();
        });

        it('don\'t ignore null properties (default)', function () {

            var json = JSON.parse( internals.readFixture('null-properties.json') );
            var expectedXml = internals.readFixture('null-properties-not-ignored.xml');

            var xml = parser.toXml(json);
            expect(xml).toEqual(expectedXml);

            return Promise.resolve();
        });

    });
});


internals.readFixture = function (file) {

    return fs.readFileSync(__dirname + '/fixtures/' + file, { encoding: 'utf-8' });
};
