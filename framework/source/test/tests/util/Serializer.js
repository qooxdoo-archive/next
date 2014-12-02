/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
describe("util.Serializer", function () {
  var __s = qx.util.Serializer;
  var __model = null;


  qx.Class.define("qx.test.SerializerModel", {
    extend: Object,
    properties: {
      data1: {
        nullable: true
      },

      data2: {
        nullable: true
      },

      data3: {
        nullable: true
      }
    }
  });


  beforeEach(function () {
    __model = new qx.test.SerializerModel();
  });


  it("UrlString", function () {
    __model.data1 = "a";
    __model.data2 = "b";
    __model.data3 = "c";
    sinonSandbox.spy()("data1=a&data2=b&data3=c", __s.toUriParameter(__model));

    __model.data1 = "A";
    __model.data2 = "B";
    __model.data3 = "C";
    sinonSandbox.spy()("data1=A&data2=B&data3=C", __s.toUriParameter(__model));

    __model.data1 = "1";
    __model.data2 = "11";
    __model.data3 = "111";
    sinonSandbox.spy()("data1=1&data2=11&data3=111", __s.toUriParameter(__model));
  });


  it("UrlStringEncoded", function () {
    __model.data1 = "ä";
    __model.data2 = "ö";
    __model.data3 = "ü";
    sinonSandbox.spy()("data1=%C3%A4&data2=%C3%B6&data3=%C3%BC", __s.toUriParameter(__model));

    __model.data1 = "–";
    __model.data2 = " ";
    __model.data3 = "ß";
    sinonSandbox.spy()("data1=%E2%80%93&data2=%20&data3=%C3%9F", __s.toUriParameter(__model));
  });


  it("UrlBoolean", function () {
    __model.data1 = true;
    __model.data2 = false;
    __model.data3 = null;
    sinonSandbox.spy()("data1=true&data2=false&data3=null", __s.toUriParameter(__model));
  });


  it("UrlNumber", function () {
    __model.data1 = 10;
    __model.data2 = -15.3443;
    __model.data3 = Number.NaN;
    sinonSandbox.spy()("data1=10&data2=-15.3443&data3=NaN", __s.toUriParameter(__model));
  });


  it("UrlKeyEncoded", function () {
    qx.Class.define("qx.test.SerializerModelEnc", {
      extend: Object,
      properties: {
        "äüö": {
          init: "ÄÜÖ"
        }
      }
    });
    var model = new qx.test.SerializerModelEnc();

    sinonSandbox.spy()("%C3%A4%C3%BC%C3%B6=%C3%84%C3%9C%C3%96", __s.toUriParameter(model));
  });


  it("UrlQxSerializer", function () {
    var qxSerializer = function (object) {
      return object.label;
    };

    var item = new qx.ui.Atom("a");
    __model.data1 = item;
    __model.data2 = "b";
    __model.data3 = "c";
    sinonSandbox.spy()("data1=a&data2=b&data3=c", __s.toUriParameter(__model, qxSerializer));

    item.dispose();
  });


  it("UrlDataArray", function () {
    var a1 = new qx.data.Array(["a"]);
    var a2 = new qx.data.Array(["a", "b"]);
    var a3 = new qx.data.Array(["a", "b", "c"]);
    __model.data1 = a1;
    __model.data2 = a2;
    __model.data3 = a3;
    assert.equal(
      "data1=a&data2=a&data2=b&data3=a&data3=b&data3=c",
      __s.toUriParameter(__model)
    );

    // get rid of the objects
    a1.dispose();
    a2.dispose();
    a3.dispose();
  });


  it("UrlDataArrayNative", function () {
    var a1 = ["a"];
    var a2 = ["a", "b"];
    var a3 = ["a", "b", "c"];
    __model.data1 = (a1);
    __model.data2 = (a2);
    __model.data3 = (a3);
    assert.equal(
      "data1=a&data2=a&data2=b&data3=a&data3=b&data3=c",
      __s.toUriParameter(__model)
    );
  });


  it("UrlInherited", function () {
    var model = new qx.ui.Atom();
    var data = __s.toUriParameter(model);
    // property included in widget
    assert.isTrue(data.indexOf("label") != -1);
    // property included in Widget (Superclass)
    assert.isTrue(data.indexOf("defaultCssClass") != -1);
    model.dispose();
  });


  it("UrlQxClass", function () {
    __model.data1 = (qx.util.Serializer);
    __model.data2 = (qx.data.IListData);
    __model.data3 = (qx.data.MBinding);
    assert.equal(
      "data1=qx.util.Serializer&data2=qx.data.IListData&data3=qx.data.MBinding",
      __s.toUriParameter(__model)
    );
  });


  it("JsonFlat", function () {
    __model.data1 = ("a");
    __model.data2 = (10.456);
    __model.data3 = (true);
    sinonSandbox.spy()('{"data1":"a","data2":10.456,"data3":true}', __s.toJson(__model));
  });


  it("JsonExp", function () {
    var date = new Date(1000);
    __model.data1 = (date);
    __model.data2 = (/[0]/);
    __model.data3 = (45e12);
    sinonSandbox.spy()('{"data1":"' + date + '","data2":"/[0]/","data3":45000000000000}', __s.toJson(__model));
  });


  it("JsonDeep2", function () {
    var model = new qx.test.SerializerModel();
    model.data1 = ("a");
    model.data2 = (11);
    model.data3 = (false);

    __model.data1 = (model);
    __model.data3 = (null);
    sinonSandbox.spy()('{"data1":{"data1":"a","data2":11,"data3":false},"data2":null,"data3":null}', __s.toJson(__model));
  });


  it("JsonArray", function () {
    __model.data1 = ([12, 1]);
    __model.data2 = (["a", "b"]);
    __model.data3 = ([true, false]);
    sinonSandbox.spy()('{"data1":[12,1],"data2":["a","b"],"data3":[true,false]}', __s.toJson(__model));
  });


  it("JsonDataArray", function () {
    __model.data1 = (new qx.data.Array([12, 1]));
    __model.data2 = (new qx.data.Array(["a", "b"]));
    __model.data3 = (new qx.data.Array([true, false]));
    sinonSandbox.spy()('{"data1":[12,1],"data2":["a","b"],"data3":[true,false]}', __s.toJson(__model));
  });


  it("JsonBig", function () {
    var model = new qx.ui.Widget();
    __s.toJson(model);
  });


  it("JsonInherited", function () {
    var model = new qx.ui.Atom();
    var data = __s.toJson(model);
    // property included in widget
    assert.isTrue(data.indexOf("enabled") != -1);
    // property included in Widget (Superclass)
    assert.isTrue(data.indexOf("defaultCssClass") != -1);
  });


  it("JsonEmpty", function () {
    __model.data1 = (new qx.data.Array());
    __model.data2 = ([]);
    __model.data3 = ({});
    sinonSandbox.spy()('{"data1":[],"data2":[],"data3":{}}', __s.toJson(__model));
  });


  it("JsonEscape", function () {
    __model.data1 = ("''");
    __model.data2 = ('""');
    __model.data3 = ("\b\t\n\f\r\\");
    sinonSandbox.spy()('{"data1":"\'\'","data2":"\\"\\"","data3":"\\b\\t\\n\\f\\r\\\\"}', __s.toJson(__model));
  });


  it("JsonQxSerializer", function () {
    var qxSerializer = function (object) {
      if (object instanceof qx.ui.Atom) {
        return object.label;
      }
    };

    var item = new qx.ui.Atom("a");
    __model.data1 = (item);
    __model.data2 = (10.456);
    __model.data3 = (true);
    sinonSandbox.spy()('{"data1":"a","data2":10.456,"data3":true}', __s.toJson(__model, qxSerializer));

    item.dispose();
  });


  it("JsonWithMarshaler", function () {
    __model.data1 = ("a");
    __model.data2 = (["b"]);
    __model.data3 = ("c");

    var json = __s.toJson(__model);
    var model = qx.data.marshal.Json.createModel(JSON.parse(json));

    sinonSandbox.spy()(__model.data1, model.data1);
    sinonSandbox.spy()(__model.data2[0], model.data2.getItem(0));
    sinonSandbox.spy()(__model.data3, model.data3);
  });


  it("JsonLateObjectSet", function () {
    var data = {
      foo: "foo",
      bar: "bar",
      goo: {}
    };

    var model = qx.data.marshal.Json.createModel(data);
    model.goo = {mi: "moo", la: "lili"};

    sinonSandbox.spy()('{"foo":"foo","bar":"bar","goo":{"mi":"moo","la":"lili"}}', qx.util.Serializer.toJson(model));
  });


  it("JsonQxClass", function () {
    __model.data1 = (qx.util.Serializer);
    __model.data2 = (qx.data.IListData);
    __model.data3 = (qx.data.MBinding);

    sinonSandbox.spy()('{"data1":"qx.util.Serializer","data2":"qx.data.IListData","data3":"qx.data.MBinding"}', __s.toJson(__model));
  });


  //
  // toNativeObject tests
  //
  it("NativeObjectFlat", function () {
    __model.data1 = ("a");
    __model.data2 = (10.456);
    __model.data3 = (true);
    assert.deepEqual(
      {
        "data1": "a",
        "data2": 10.456,
        "data3": true
      },
      __s.toNativeObject(__model));
  });


  it("NativeObjectExp", function () {
    var date = new Date();
    __model.data1 = (date);
    __model.data2 = (/[0]/);
    __model.data3 = (45e12);
    assert.deepEqual(
      {
        "data1": date,
        "data2": /[0]/,
        "data3": 45e12
      },
      __s.toNativeObject(__model));
  });


  it("NativeObjectDeep2", function () {
    var model = new qx.test.SerializerModel();
    model.data1 = ("a");
    model.data2 = (11);
    model.data3 = (false);

    __model.data1 = (model);
    __model.data3 = (null);
    assert.deepEqual(
      {
        "data1": {
          "data1": "a",
          "data2": 11,
          "data3": false
        },
        "data2": null,
        "data3": null
      },
      __s.toNativeObject(__model));
  });


  it("NativeObjectArray", function () {
    __model.data1 = ([12, 1]);
    __model.data2 = (["a", "b"]);
    __model.data3 = ([true, false]);
    assert.deepEqual(
      {
        "data1": [12, 1],
        "data2": ["a", "b"],
        "data3": [true, false]
      },
      __s.toNativeObject(__model));
  });


  it("NativeObjectDataArray", function () {
    __model.data1 = (new qx.data.Array([12, 1]));
    __model.data2 = (new qx.data.Array(["a", "b"]));
    __model.data3 = (new qx.data.Array([true, false]));
    assert.deepEqual(
      {
        "data1": [12, 1],
        "data2": ["a", "b"],
        "data3": [true, false]
      },
      __s.toNativeObject(__model));

    __model.data1.dispose();
    __model.data2.dispose();
    __model.data3.dispose();
  });


  it("NativeObjectBig", function () {
    var model = new qx.ui.Widget();
    __s.toNativeObject(model);
    model.dispose();
  });


  it("NativeObjectEmpty", function () {
    __model.data1 = (new qx.data.Array());
    __model.data2 = ([]);
    __model.data3 = (new Object());
    assert.deepEqual(
      {
        "data1": [],
        "data2": [],
        "data3": {}
      },
      __s.toNativeObject(__model));

    __model.data1.dispose();
  });


  it("NativeObjectEscape", function () {
    __model.data1 = ("''");
    __model.data2 = ('""');
    __model.data3 = ("\b\t\n\f\r\\");
    assert.deepEqual(
      {
        "data1": "''",
        "data2": '""',
        "data3": "\b\t\n\f\r\\"
      },
      __s.toNativeObject(__model));
  });


  it("NativeObjectQxSerializer", function () {
    var qxSerializer = function (object) {
      if (object instanceof qx.ui.Atom) {
        return object.label;
      }
    };

    var item = new qx.ui.Atom("a");
    __model.data1 = (item);
    __model.data2 = (10.456);
    __model.data3 = (true);
    assert.deepEqual(
      {
        "data1": "a",
        "data2": 10.456,
        "data3": true
      },
      __s.toNativeObject(__model, qxSerializer));

    item.dispose();
  });


  it("NativeObjectQxClass", function () {
    __model.data1 = (qx.util.Serializer);
    __model.data2 = (qx.data.IListData);
    __model.data3 = (qx.data.MBinding);
    assert.deepEqual(
      {
        "data1": "qx.util.Serializer",
        "data2": "qx.data.IListData",
        "data3": "qx.data.MBinding"
      },
      __s.toNativeObject(__model));
  });

});
