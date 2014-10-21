/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("lang.Json", function()
{

  beforeEach (function ()
  {
      // Test either native (when available) or emulated JSON,
      // see [BUG #5037]
      JSON = qx.lang.Json;
  });


  it("StringifyArray", function() {
      var text = JSON.stringify(['e', {pluribus: 'unum'}]);
      assert.equal('["e",{"pluribus":"unum"}]', text);
  });


  it("FormattingString", function() {
      var str = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
      var expected = /[\n\t"e",\n\t{\n\t\t"pluribus":\s?"unum"\n\t}\n]/;
      assert.match(str, expected);
  });


  it("FormattingNumber", function() {
      var str = JSON.stringify(['e', {pluribus: 'unum'}], null, 2);
      var expected = /[\n  "e",\n  {\n    "pluribus":\s"unum"\n  }\n]/;
      assert.match(str, expected);
  });


  it("Replacer", function() {
      var obj = [new Date(0), "foo"];

      var self = this;
      var replacer = function(key, value) {
        return this[key] instanceof Date ? 'Date(' + this[key].getTime() + ')' : value;
      };

      var json = JSON.stringify(obj, replacer);
      assert.equal('["Date(0)","foo"]', json);
  });

    // Uncovers browser bug found in Firefox >=3.5 && < 4, see
    // https://bugzilla.mozilla.org/show_bug.cgi?id=509184

  it("ReplacerNestedObject", function() {
      var obj = {"prop": "value"};

      var replacer = function(key, value) {
        if (value == "value") {
          return "replaced";
        }
        return value;
      };

      var json = JSON.stringify(obj, replacer);
      assert.match(json, /replaced/);
  });


  it("ReplacerWhiteList", function() {
      var list = ["name"];
      var text = JSON.stringify({name: "Peter", last: "Pan"}, list);

      assert.equal('{"name":"Peter"}', text);
  });


  it("StringifyObject", function() {
      assert.equal('{"test":123}', JSON.stringify({ test : 123 }));
  });


  it("StringifyDate", function() {
      var data = {
        start: new Date(0)
      };
      assert.match(
        JSON.stringify(data),new RegExp('\{"start":"1970\-01\-01T00:00:00\(\.0*)?Z"\}');
      );
  });


  it("CustomDateSerializer", function() {
      var date = new Date(0);
      date.toJSON = function(key) {
        return this.valueOf();
      };

      var result = JSON.stringify(date);

      // Expected '0' but found '0'! in Opera
      // assert.equal("0", result);

      assert("0".charCodeAt() == result.charCodeAt());
  });


  it("ToJson", function() {
      var obj = {
        toJSON : function(key) {
          return "##";
        }
      };

      assert.equal('"##"', JSON.stringify(obj));
  });


  it("ToJsonKey", function() {
      // Known to fail in some browsers:
      //
      // Firefox: toJSON is passed no parameter, i.e. key is undefined
      //          undefined + "" is "undefined" in Firefox
      //
      // IE 8:    toJSON is passed the string "\u0082\u0000\u0000\u0000",
      //          which is the equivalent of "BREAK PERMITTED HERE" and two
      //          "NUL".
      //
      if (isFirefox() || isIe8()) {
        throw new qx.dev.unit.RequirementError();
      }

      var obj = {
        toJSON : function(key) {
          return "#" + key + "#";
        }
      };

      var str = JSON.stringify({ juhu : obj });
      assert.match(str, /#juhu#/);
  });


  it("StringifyRecursiveObject", function() {
      var obj = {};
      obj.foo = obj;

      assert.throw(function() {
        var text = JSON.stringify(obj);
      });

      obj = [];
      obj[0] = obj;

      assert.throw(function() {
        var text = JSON.stringify(obj);
      });
  });


  it("IgnoreNamedPropertiesInArrays", function() {
      var data = [1, "foo"];
      data.juhu = "kinners"; // must be ignored

      assert.equal('[1,"foo"]', JSON.stringify(data));
  });


  it("IgnoreFunction", function() {
      var data = {
        juhu: "kinners",
        foo: function() {}
      };
      assert.equal('{"juhu":"kinners"}', JSON.stringify(data));
  });


  it("SimpleParse", function() {
      var data = JSON.parse('{"juhu":"kinners","age":23,"foo":[1,2,3]}');

      // check keys
      assert.equal(
        ["juhu", "foo", "age"].sort().toString(),
        Object.keys(data).sort().toString()
      );

      // check values
      assert.equal("kinners", data.juhu);
      assert.equal(23, data.age);
      assert.deepEqual([1, 2, 3], data.foo);
  });


  it("ParseNumber", function() {
      assert.equal(1234, JSON.parse("1234"));
      assert.equal(1234, JSON.parse(" 1234"));
  });


  it("ParseRevive", function() {
      var json = '{"prop": "value"}';

      var obj = JSON.parse(json, function(key, value) {
        if (value == "value") {
          return "revived";
        }
        return value;
      });

      assert.equal("revived", obj.prop);
  });


  function isIe8()
  {
    return qx.core.Environment.get("engine.name") === "mshtml" &&
           (qx.core.Environment.get("engine.version") == 8 ||
            qx.core.Environment.get("browser.documentmode") == 8);
  }


  function isFirefox ()
  {
    return qx.core.Environment.get("engine.name") === "gecko";
  }

});
