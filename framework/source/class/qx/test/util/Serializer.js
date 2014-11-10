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

/**
 * @ignore(qx.test.SerializerModel)
 * @ignore(qx.test.SerializerModelEnc)
 */

qx.Class.define("qx.test.util.Serializer",
{
  extend : qx.dev.unit.TestCase,

  construct : function() {
    this.__s = qx.util.Serializer;

    qx.Class.define("qx.test.SerializerModel", {
      extend : Object,
      properties : {
        data1 : {
          nullable: true
        },

        data2 : {
          nullable: true
        },

        data3 : {
          nullable: true
        }
      }
    });
  },

  members :
  {
    __model: null,
    __s: null,


    setUp : function() {
      this.__model = new qx.test.SerializerModel();
    },


    testUrlString : function() {
      this.__model.data1 = "a";
      this.__model.data2 = "b";
      this.__model.data3 = "c";
      this.assertEquals("data1=a&data2=b&data3=c", this.__s.toUriParameter(this.__model));

      this.__model.data1 = "A";
      this.__model.data2 = "B";
      this.__model.data3 = "C";
      this.assertEquals("data1=A&data2=B&data3=C", this.__s.toUriParameter(this.__model));

      this.__model.data1 = "1";
      this.__model.data2 = "11";
      this.__model.data3 = "111";
      this.assertEquals("data1=1&data2=11&data3=111", this.__s.toUriParameter(this.__model));
    },

    testUrlStringEncoded : function() {
      this.__model.data1 = "ä";
      this.__model.data2 = "ö";
      this.__model.data3 = "ü";
      this.assertEquals("data1=%C3%A4&data2=%C3%B6&data3=%C3%BC", this.__s.toUriParameter(this.__model));

      this.__model.data1 = "–";
      this.__model.data2 = " ";
      this.__model.data3 = "ß";
      this.assertEquals("data1=%E2%80%93&data2=%20&data3=%C3%9F", this.__s.toUriParameter(this.__model));
    },

    testUrlBoolean : function() {
      this.__model.data1 = true;
      this.__model.data2 = false;
      this.__model.data3 = null;
      this.assertEquals("data1=true&data2=false&data3=null", this.__s.toUriParameter(this.__model));
    },

    testUrlNumber : function() {
      this.__model.data1 = 10;
      this.__model.data2 = -15.3443;
      this.__model.data3 = Number.NaN;
      this.assertEquals("data1=10&data2=-15.3443&data3=NaN", this.__s.toUriParameter(this.__model));
    },


    testUrlKeyEncoded : function() {
      qx.Class.define("qx.test.SerializerModelEnc", {
        extend: Object,
        properties : {
          "äüö" : {
            init: "ÄÜÖ"
          }
        }
      });
      var model = new qx.test.SerializerModelEnc();

      this.assertEquals("%C3%A4%C3%BC%C3%B6=%C3%84%C3%9C%C3%96", this.__s.toUriParameter(model));
    },


    testUrlQxSerializer : function()
    {
      var qxSerializer = function(object) {
        return object.label;
      };

      var item = new qx.ui.basic.Atom("a");
      this.__model.data1 = item;
      this.__model.data2 = "b";
      this.__model.data3 = "c";
      this.assertEquals("data1=a&data2=b&data3=c", this.__s.toUriParameter(this.__model, qxSerializer));

      item.dispose();
    },

    testUrlDataArray : function() {
      var a1 = new qx.data.Array(["a"]);
      var a2 = new qx.data.Array(["a", "b"]);
      var a3 = new qx.data.Array(["a", "b", "c"]);
      this.__model.data1 = a1;
      this.__model.data2 = a2;
      this.__model.data3 = a3;
      this.assertEquals(
        "data1=a&data2=a&data2=b&data3=a&data3=b&data3=c",
        this.__s.toUriParameter(this.__model)
      );

      // get rid of the objects
      a1.dispose();
      a2.dispose();
      a3.dispose();
    },

    testUrlDataArrayNative : function() {
      var a1 = ["a"];
      var a2 = ["a", "b"];
      var a3 = ["a", "b", "c"];
      this.__model.data1 = (a1);
      this.__model.data2 = (a2);
      this.__model.data3 = (a3);
      this.assertEquals(
        "data1=a&data2=a&data2=b&data3=a&data3=b&data3=c",
        this.__s.toUriParameter(this.__model)
      );
    },

    testUrlInherited : function() {
      var model = new qx.ui.basic.Atom();
      var data = this.__s.toUriParameter(model);
      // property included in widget
      this.assertTrue(data.indexOf("label") != -1);
      // property included in Widget (Superclass)
      this.assertTrue(data.indexOf("defaultCssClass") != -1);
      model.dispose();
    },


    testUrlQxClass : function() {
      this.__model.data1 = (qx.util.Serializer);
      this.__model.data2 = (qx.data.IListData);
      this.__model.data3 = (qx.data.MBinding);
      this.assertEquals(
        "data1=qx.util.Serializer&data2=qx.data.IListData&data3=qx.data.MBinding",
        this.__s.toUriParameter(this.__model)
      );
    },


    testJsonFlat : function() {
      this.__model.data1 = ("a");
      this.__model.data2 = (10.456);
      this.__model.data3 = (true);
      this.assertEquals('{"data1":"a","data2":10.456,"data3":true}', this.__s.toJson(this.__model));
    },


    testJsonExp : function() {
      var date = new Date(1000);
      this.__model.data1 = (date);
      this.__model.data2 = (/[0]/);
      this.__model.data3 = (45e12);
      this.assertEquals('{"data1":"' + date + '","data2":"/[0]/","data3":45000000000000}', this.__s.toJson(this.__model));
    },


    testJsonDeep2 : function() {
      var model = new qx.test.SerializerModel();
      model.data1 = ("a");
      model.data2 = (11);
      model.data3 = (false);

      this.__model.data1 = (model);
      this.__model.data3 = (null);
      this.assertEquals('{"data1":{"data1":"a","data2":11,"data3":false},"data2":null,"data3":null}', this.__s.toJson(this.__model));
    },


    testJsonArray : function() {
      this.__model.data1 = ([12, 1]);
      this.__model.data2 = (["a", "b"]);
      this.__model.data3 = ([true, false]);
      this.assertEquals('{"data1":[12,1],"data2":["a","b"],"data3":[true,false]}', this.__s.toJson(this.__model));
    },

    testJsonDataArray : function() {
      this.__model.data1 = (new qx.data.Array([12, 1]));
      this.__model.data2 = (new qx.data.Array(["a", "b"]));
      this.__model.data3 = (new qx.data.Array([true, false]));
      this.assertEquals('{"data1":[12,1],"data2":["a","b"],"data3":[true,false]}', this.__s.toJson(this.__model));
    },

    testJsonBig : function() {
      var model = new qx.ui.Widget();
      this.__s.toJson(model);
    },

    testJsonInherited : function() {
      var model = new qx.ui.basic.Atom();
      var data = this.__s.toJson(model);
      // property included in widget
      this.assertTrue(data.indexOf("enabled") != -1);
      // property included in Widget (Superclass)
      this.assertTrue(data.indexOf("defaultCssClass") != -1);
    },

    testJsonEmpty : function() {
      this.__model.data1 = (new qx.data.Array());
      this.__model.data2 = ([]);
      this.__model.data3 = ({});
      this.assertEquals('{"data1":[],"data2":[],"data3":{}}', this.__s.toJson(this.__model));
    },


    testJsonEscape : function() {
      this.__model.data1 = ("''");
      this.__model.data2 = ('""');
      this.__model.data3 = ("\b\t\n\f\r\\");
      this.assertEquals('{"data1":"\'\'","data2":"\\"\\"","data3":"\\b\\t\\n\\f\\r\\\\"}', this.__s.toJson(this.__model));
    },

    testJsonQxSerializer : function()
    {
      var qxSerializer = function(object) {
        if (object instanceof qx.ui.basic.Atom) {
          return object.label;
        }
      };

      var item = new qx.ui.basic.Atom("a");
      this.__model.data1 = (item);
      this.__model.data2 = (10.456);
      this.__model.data3 = (true);
      this.assertEquals('{"data1":"a","data2":10.456,"data3":true}', this.__s.toJson(this.__model, qxSerializer));

      item.dispose();
    },

    testJsonWithMarshaler : function()
    {
      this.__model.data1 = ("a");
      this.__model.data2 = (["b"]);
      this.__model.data3 = ("c");

      var json = this.__s.toJson(this.__model);
      var model = qx.data.marshal.Json.createModel(JSON.parse(json));

      this.assertEquals(this.__model.data1, model.data1);
      this.assertEquals(this.__model.data2[0], model.data2.getItem(0));
      this.assertEquals(this.__model.data3, model.data3);
    },

    testJsonLateObjectSet : function()
    {
      var data = {
        foo : "foo",
        bar : "bar",
        goo : {}
      };

      var model = qx.data.marshal.Json.createModel(data);
      model.goo = {mi:"moo",la:"lili"};

      this.assertEquals('{"foo":"foo","bar":"bar","goo":{"mi":"moo","la":"lili"}}', qx.util.Serializer.toJson(model));
    },


    testJsonQxClass : function() {
      this.__model.data1 = (qx.util.Serializer);
      this.__model.data2 = (qx.data.IListData);
      this.__model.data3 = (qx.data.MBinding);

      this.assertEquals('{"data1":"qx.util.Serializer","data2":"qx.data.IListData","data3":"qx.data.MBinding"}', this.__s.toJson(this.__model));
    },


    //
    // toNativeObject tests
    //


    testNativeObjectFlat : function() {
      this.__model.data1 = ("a");
      this.__model.data2 = (10.456);
      this.__model.data3 = (true);
      this.assertJsonEquals(
        {
          "data1" : "a",
          "data2" : 10.456,
          "data3" : true
        },
        this.__s.toNativeObject(this.__model));
    },


    testNativeObjectExp : function() {
      var date = new Date();
      this.__model.data1 = (date);
      this.__model.data2 = (/[0]/);
      this.__model.data3 = (45e12);
      this.assertJsonEquals(
        {
          "data1" : date,
          "data2" : /[0]/,
          "data3" : 45e12
        },
        this.__s.toNativeObject(this.__model));
    },


    testNativeObjectDeep2 : function() {
      var model = new qx.test.SerializerModel();
      model.data1 = ("a");
      model.data2 = (11);
      model.data3 = (false);

      this.__model.data1 = (model);
      this.__model.data3 = (null);
      this.assertJsonEquals(
        {
          "data1" :
          {
            "data1" : "a",
            "data2" : 11,
            "data3" : false
          },
          "data2" : null,
          "data3" : null
        },
        this.__s.toNativeObject(this.__model));
    },


    testNativeObjectArray : function() {
      this.__model.data1 = ([12, 1]);
      this.__model.data2 = (["a", "b"]);
      this.__model.data3 = ([true, false]);
      this.assertJsonEquals(
        {
          "data1" : [12,1],
          "data2" : ["a","b"],
          "data3" : [true,false]
        },
        this.__s.toNativeObject(this.__model));
    },

    testNativeObjectDataArray : function() {
      this.__model.data1 = (new qx.data.Array([12, 1]));
      this.__model.data2 = (new qx.data.Array(["a", "b"]));
      this.__model.data3 = (new qx.data.Array([true, false]));
      this.assertJsonEquals(
        {
          "data1" : [12,1],
          "data2" : ["a","b"],
          "data3" : [true,false]
        },
        this.__s.toNativeObject(this.__model));

      this.__model.data1.dispose();
      this.__model.data2.dispose();
      this.__model.data3.dispose();
    },

    testNativeObjectBig : function() {
      var model = new qx.ui.Widget();
      this.__s.toNativeObject(model);
      model.dispose();
    },


    testNativeObjectEmpty : function() {
      this.__model.data1 = (new qx.data.Array());
      this.__model.data2 = ([]);
      this.__model.data3 = (new Object());
      this.assertJsonEquals(
        {
          "data1" : [],
          "data2" : [],
          "data3" : {}
        },
        this.__s.toNativeObject(this.__model));

      this.__model.data1.dispose();
    },


    testNativeObjectEscape : function() {
      this.__model.data1 = ("''");
      this.__model.data2 = ('""');
      this.__model.data3 = ("\b\t\n\f\r\\");
      this.assertJsonEquals(
        {
          "data1" : "''",
          "data2" : '""',
          "data3" : "\b\t\n\f\r\\"
        },
        this.__s.toNativeObject(this.__model));
    },

    testNativeObjectQxSerializer : function()
    {
      var qxSerializer = function(object) {
        if (object instanceof qx.ui.basic.Atom) {
          return object.label;
        }
      };

      var item = new qx.ui.basic.Atom("a");
      this.__model.data1 = (item);
      this.__model.data2 = (10.456);
      this.__model.data3 = (true);
      this.assertJsonEquals(
        {
          "data1" : "a",
          "data2" : 10.456,
          "data3" : true
        },
        this.__s.toNativeObject(this.__model, qxSerializer));

      item.dispose();
    },


    testNativeObjectQxClass : function() {
      this.__model.data1 = (qx.util.Serializer);
      this.__model.data2 = (qx.data.IListData);
      this.__model.data3 = (qx.data.MBinding);
      this.assertJsonEquals(
        {
          "data1" : "qx.util.Serializer",
          "data2" : "qx.data.IListData",
          "data3" : "qx.data.MBinding"
        },
        this.__s.toNativeObject(this.__model));
    },


    /* ******************************
     * DATE FORMATER
     * **************************** */

    __setUpDateModel : function() {
      var formater = new qx.util.format.DateFormat("yyyy-mm-dd", "en");
      var date1 = new Date(0);
      var date2 = new Date(100000);
      var date3 = new Date(25168418651);
      this.__model.data1 = date1;
      this.__model.data2 = date2;
      this.__model.data3 = date3;
      return formater;
    },

    testDateFormaterNative : function() {
      var formater = this.__setUpDateModel();

      this.assertJsonEquals(
        {
          "data1" : "1970-00-01",
          "data2" : "1970-01-01",
          "data3" : "1970-13-19"
        },
        this.__s.toNativeObject(this.__model, null, formater)
      );

      formater.dispose();
    },

    testDateFormaterJson : function() {
      var formater = this.__setUpDateModel();

      this.assertEquals(
        '{"data1":"1970-00-01","data2":"1970-01-01","data3":"1970-13-19"}',
        this.__s.toJson(this.__model, null, formater)
      );

      formater.dispose();
    },

    testDateFormaterUrl : function() {
      var formater = this.__setUpDateModel();

      this.assertEquals(
        "data1=1970-00-01&data2=1970-01-01&data3=1970-13-19",
        this.__s.toUriParameter(this.__model, null, formater)
      );

      formater.dispose();
    },


    /* ******************************
     * Localized strings
     * **************************** */

    testJsonLocalizedStrings : function() {
      this.assertEquals(
        '"test affe"', qx.util.Serializer.toJson(qx.locale.Manager.tr("test affe"))
      );
    },

    testNativeLocalizedStrings : function() {
      var ser = qx.util.Serializer.toNativeObject(qx.locale.Manager.tr("test affe"));
      this.assertEquals("test affe", ser);
      // regular strings should not have a translate method
      this.assertUndefined(ser.translate);
    },

    testUrlLocalizedStrings : function() {
      this.__model.data1 = (qx.locale.Manager.tr("test affe"));
      this.__model.data2 = null;
      this.__model.data3 = null;
      this.assertEquals(
        "data1=test%20affe&data2=null&data3=null",
        qx.util.Serializer.toUriParameter(this.__model)
      );
    }
  }
});
