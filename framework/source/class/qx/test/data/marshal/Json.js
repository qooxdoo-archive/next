/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * @asset(qx/test/*)
 *
 * @ignore(qx.data.model)
 * @ignore(qx.test.model.*)
 * @ignore(qx.Test)
 * @ignore(qx.test.Array)
 */
qx.Bootstrap.define("qx.test.data.marshal.Json",
{
  extend : qx.dev.unit.TestCase,
  include : qx.dev.unit.MMock,

  members :
  {
    __marshaler : null,
    __data : null,
    __propertyNames : null,

    setUp : function() {
      this.__marshaler = new qx.data.marshal.Json();

      this.__data = {s: 'String', n: 12, b: true};
      this.__propertyNames = ["s", "n", "b"];
    },


    tearDown : function() {
      // remove the former created classes
      qx.data.model = {};
    },


    "test$$member" : function() {
      var data = {$$a : "b"};
      this.__marshaler.toClass(data);

      // check if the class is defined
      this.assertNotNull(qx.Bootstrap.getByName('qx.data.model.$$a'), "Class not created.");

      var clazz = qx.Bootstrap.getByName('qx.data.model.$$a');
      // check for the property
      for (var name in clazz.prototype.$$properties) {
        this.assertEquals("$$a", name, "Property $$a does have the wrong name.");
        this.assertTrue(clazz.prototype.$$properties[name].event, "event has a wrong name.");
      }
    },


    testLocalizedString : function () {
      var str = qx.locale.Manager.tr("test one");
      var data = {a : str};
      this.__marshaler.toClass(data);

      var model = this.__marshaler.toModel(data);

      this.assertEquals(str, model.a);
    },


    testClassCreationSingle: function() {
      this.__marshaler.toClass(this.__data);

      // check if the class is defined
      this.assertNotNull(qx.Bootstrap.getByName('qx.data.model.b"n"s'), "Class not created.");

      var clazz = qx.Bootstrap.getByName('qx.data.model.b"n"s');
      // check for the properties
      var i = 0;
      for (var name in clazz.prototype.$$properties) {
        this.assertEquals(this.__propertyNames[i], name, "Property " + i + "does have the wrong name.");
        this.assertTrue(clazz.prototype.$$properties[name].event, "event has a wrong name.");
        i++;
      }
    },


    testClassCreationArray: function() {
      this.__data = {a: ['a', 'b', 'c']};

      this.__marshaler.toClass(this.__data);

      // check if the class is defined
      this.assertNotNull(qx.Bootstrap.getByName("qx.data.model.a"), "Class not created.");

      var clazz = qx.Bootstrap.getByName("qx.data.model.a");
      // check for the property
      this.assertNotNull(clazz.prototype.$$properties.a, "Property does not exist.");
    },


    testClassCreationObject: function() {
      this.__data = {a: {b: 'test'}};

      this.__marshaler.toClass(this.__data);

      // check if the classes are defined
      this.assertEquals("qx.data.model.a", qx.data.model.a.classname, "Class not created.");
      this.assertEquals("qx.data.model.b", qx.data.model.b.classname, "Class not created.");

      // check for the property
      this.assertNotNull(qx.data.model.a.prototype.$$properties.a, "Property does not exist.");
      this.assertNotNull(qx.data.model.b.prototype.$$properties.b, "Property does not exist.");
    },


    testClassCreationArrayWithObject: function() {
      this.__data = {a: [{b: 'test'}, {b: 'test'}]};

      this.__marshaler.toClass(this.__data);

      // check if the classes are defined
      this.assertNotNull(qx.Bootstrap.getByName("qx.data.model.a"), "Class not created.");
      this.assertNotNull(qx.Bootstrap.getByName("qx.data.model.b"), "Class not created.");

      var clazz = qx.Bootstrap.getByName("qx.data.model.a");
      var clazz2 = qx.Bootstrap.getByName("qx.data.model.b");
      // check for the property
      this.assertNotNull(clazz.prototype.$$properties.a, "Property does not exist.");
      this.assertNotNull(clazz2.prototype.$$properties.b, "Property does not exist.");
    },


    testClassCreationAllSmoke: function() {
      this.__data = {a: [{b: 'test', c: ['f', 'x', 'e']}, {b: 'test', affe: false}], t: {f: null, r: 152, q: true}};
      this.__marshaler.toClass(this.__data);
    },


    testModelWithNumber: function() {
      this.__data = {a: 10, b: -15, c: 10.5e10};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      this.assertEquals(10, model.a, "getA does not work.");
      this.assertEquals(-15, model.b, "getB does not work.");
      this.assertEquals(10.5e10, model.c, "getC does not work.");
    },


    testModelWithBoolean: function() {
      this.__data = {a: true, b: false};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      this.assertEquals(true, model.a, "getA does not work.");
      this.assertEquals(false, model.b, "getB does not work.");
    },


    testModelWithString: function() {
      this.__data = {a: 'affe', b: 'AFFE'};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      this.assertEquals("affe", model.a, "getA does not work.");
      this.assertEquals("AFFE", model.b, "getB does not work.");
    },


    testModelWithPrimitive: function() {
      this.__data = {a: 'affe', b: true, c: 156};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      this.assertEquals("affe", model.a, "getA does not work.");
      this.assertEquals(true, model.b, "getB does not work.");
      this.assertEquals(156, model.c, "getC does not work.");

    },


    testModelWithArrayPrimitive: function() {
      this.__data = {a: ['affe', 'affen', 'AFFE']};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      var a = model.a;
      this.assertNotNull(a, "Nothing stored in the property a.");
      this.assertEquals("qx.data.Array", a.classname, "Its not an data array.");
      this.assertEquals("affe", a.getItem(0), "Item 0 is wrong");
      this.assertEquals("affen", a.getItem(1), "Item 1 is wrong");
      this.assertEquals("AFFE", a.getItem(2), "Item 2 is wrong");

    },


    testModelWithArrayArray: function() {
      this.__data = {a: [[true, false], [10, 15]]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      var a = model.a;
      this.assertNotNull(a, "Nothing stored in the property a.");
      this.assertEquals("qx.data.Array", a.classname, "Its not an data array.");

      var a0 = a.getItem(0);
      this.assertEquals("qx.data.Array", a0.classname, "Its not an data array.");
      this.assertEquals(true, a0.getItem(0), "Item 0 is wrong");
      this.assertEquals(false, a0.getItem(1), "Item 1 is wrong");

      var a1 = a.getItem(1);
      this.assertEquals("qx.data.Array", a1.classname, "Its not an data array.");
      this.assertEquals(10, a1.getItem(0), "Item 0 is wrong");
      this.assertEquals(15, a1.getItem(1), "Item 1 is wrong");

    },


    testModelWithObjectPrimitive: function() {
      this.__data = {a: {b: true, bb: false}, aa: {c: 15, cc: -89}};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      var a = model.a;
      this.assertNotNull(a, "Nothing stored in the property a.");
      this.assertEquals(true, a.b, "b is not set");
      this.assertEquals(false, a.bb, "bb is not set");

      var aa = model.aa;
      this.assertNotNull(aa, "Nothing stored in the property a.");
      this.assertEquals(15, aa.c, "c is not set");
      this.assertEquals(-89, aa.cc, "cc is not set");

    },


    testModelWithObjectArray: function() {
      this.__data = {a: {b: ['affe', 'AFFE']}};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      var a = model.a;
      this.assertNotNull(a, "Nothing stored in the property a.");
      var b = a.b;
      this.assertNotNull(b, "Nothing stored in the property b.");
      this.assertEquals("qx.data.Array", b.classname, "b is not an data array");
      this.assertEquals("affe", b.getItem(0), "Item 0 is wrong.");
      this.assertEquals("AFFE", b.getItem(1), "Item 1 is wrong.");
    },


    testModelWithArrayObject: function() {
      this.__data = {a: [{a: 15}, {a: true}]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      var a = model.a;
      this.assertNotNull(a, "Nothing stored in the property a.");
      this.assertEquals("qx.data.Array", a.classname, "b is not an data array");

      this.assertEquals(15, a.getItem(0).a, "Item 0 is wrong.");
      this.assertEquals(true, a.getItem(1).a, "Item 1 is wrong.");

      // check if only one class is created and used
      this.assertEquals(model.classname, a.getItem(0).classname, "Differen classes");
      this.assertEquals(model.classname, a.getItem(1).classname, "Differen classes");
      this.assertEquals(a.getItem(0).classname, a.getItem(1).classname, "Differen classes");
    },


    testModelWithObjectObject: function() {
      this.__data = {a: {a: {a: 'affe'}}};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      this.assertEquals("affe", model.a.a.a, "No affe is there!");
    },


    testModelWithAllSmoke: function() {
      this.__data = {a: [{aa: ['affe'], ab: false, ac: []}, {}, true, 15, 'affe'], b: 'Affe', c: {ca: 156, cb: [null, null], cc: true}};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      this.assertNotNull(model, "No model set.");
    },


    testBubbleEventsDepth1: function() {
      this.__data = {a: 10, b: -15, c: 10.5e10};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for a
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a = (0);
      }, function(data) {
        self.assertEquals(0, data.value, "Not the right value in the event.");
        self.assertEquals(10, data.old, "Not the right old value in the event.");
        self.assertEquals("a", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model, data.item, "Not the right item in the event.");
      }, "Change event not fired!");

      // check the event for b
      this.assertEventFired(model, "changeBubble", function() {
        model.b = (0);
      }, function(data) {
        self.assertEquals(0, data.value, "Not the right value in the event.");
        self.assertEquals(-15, data.old, "Not the right old value in the event.");
        self.assertEquals("b", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model, data.item, "Not the right item in the event.");
      }, "Change event not fired!");
    },


    testBubbleEventsDepth2: function() {
      this.__data = {a: {b: 10, c: 20}};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for b
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.b = (0);
      }, function(data) {
        self.assertEquals(0, data.value, "Not the right value in the event.");
        self.assertEquals(10, data.old, "Not the right old value in the event.");
        self.assertEquals("a.b", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a, data.item, "Not the right item in the event.");
      }, "Change event not fired!");

      // check the event for a
      this.assertEventFired(model, "changeBubble", function() {
        model.a = (true);
      }, function(data) {
        self.assertEquals(true, data.value, "Not the right value in the event.");
        self.assertEquals("a", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model, data.item, "Not the right item in the event.");
      }, "Change event not fired!");

    },


    testBubbleEventsDepth3: function() {
      this.__data = {a: {b: {c: 10}}};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for c
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.b.c = (0);
      }, function(data) {
        self.assertEquals(0, data.value, "Not the right value in the event.");
        self.assertEquals(10, data.old, "Not the right old value in the event.");
        self.assertEquals("a.b.c", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a.b, data.item, "Not the right item in the event.");
      }, "Change event not fired!");

    },


    testBubbleEventsArrayDepth1: function() {
      this.__data = {a: [12, 23, 34]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for the first array element
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.setItem(0, 1);
      }, function(data) {
        self.assertEquals(1, data.value, "Not the right value in the event.");
        self.assertEquals("a[0]", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a, data.item, "Not the right item in the event.");
      }, "Change event not fired!");


    },


    testBubbleEventsArrayDepth2: function() {
      this.__data = {a: [{b: 10}, {b: 11}]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for the first array element
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.getItem(0).b = (0);
      }, function(data) {
        self.assertEquals(0, data.value, "Not the right value in the event.");
        self.assertEquals("a[0].b", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a.getItem(0), data.item, "Not the right item in the event.");
      }, "Change event not fired!");

    },


    testBubbleEventsArrayDepthAlot: function() {
      this.__data = {a: [[[[{b:10}]]]]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for the first array element
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.getItem(0).getItem(0).getItem(0).getItem(0).b = (0);
      }, function(data) {
        self.assertEquals(0, data.value, "Not the right value in the event.");
        self.assertEquals("a[0][0][0][0].b", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a.getItem(0).getItem(0).getItem(0).getItem(0), data.item, "Not the right item in the event.");
      }, "Change event not fired!");

    },


    testBubbleEventsArrayDepthAlotMix: function() {
      this.__data = {a: [ {b: [ [{c: {d: [0, 1]}}] ]} ]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for the first array element
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.getItem(0).b.getItem(0).getItem(0).c.d.setItem(1, 12);
      }, function(data) {
        self.assertEquals(12, data.value, "Not the right value in the event.");
        self.assertEquals("a[0].b[0][0].c.d[1]", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a.getItem(0).b.getItem(0).getItem(0).c.d, data.item, "Not the right item in the event.");
      }, "Change event not fired!");

    },


    testBubbleEventsArrayLong: function() {
      this.__data = {a: [0, 1, 2, 3, 4, 5, 6 , 7, 8, 9, 10]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the event for the first array element
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.setItem(10, "AFFE");
      }, function(data) {
        self.assertEquals("AFFE", data.value, "Not the right value in the event.");
        self.assertEquals("a[10]", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a, data.item, "Not the right item in the event.");
      }, "Change event not fired!");

    },


    testBubbleEventsArrayReorder: function() {
      this.__data = {a: [11, 1, 2, 3, 4, 5, 6 , 7, 8, 9, 10]};
      // first create the classes before setting the data
      this.__marshaler.toClass(this.__data, true);
      // set the data
      var model = this.__marshaler.toModel(this.__data);

      model.a.sort();

      // check the event for the first array element
      var self = this;
      this.assertEventFired(model, "changeBubble", function() {
        model.a.setItem(0, "AFFE");
      }, function(data) {
        self.assertEquals("AFFE", data.value, "Not the right value in the event.");
        self.assertEquals("a[0]", data.name, "Not the right name in the event.");
        self.assertString(data.name, "name is not a String.");
        self.assertEquals(model.a, data.item, "Not the right item in the event.");
      }, "Change event not fired!");

    },


    testBubbleEventsWithRemove: function() {
      qx.Bootstrap.define("qx.Test", {
        extend : qx.event.Emitter,
        include : qx.data.marshal.MEventBubbling,
        properties : {
          fonts: {
            "event": "changeFonts",
            "check": "qx.data.Array",
            "apply": "_applyEventPropagation"
          }
        }
      });

      var model = new qx.Test();
      var fonts = new qx.data.Array();
      model.fonts = fonts;
      model.fonts.push("one", "two", "three");

      model.on("changeBubble", function(data) {
        this.assertEquals("fonts[0-2]", data.name, "Wrong name");
        this.assertString(data.name, "name is not a String.");
        this.assertArrayEquals(["one", "two", "three"], data.old, "Wrong old data");
        this.assertEquals(0, data.value.length, "Wrong data");
      }, this);

      // remove all
      model.fonts.removeAll();

      this.assertEquals(0, model.fonts.length, "The remove did not work.");
    },


    testQooxdooObject : function()
    {
      var qxObject = new qxWeb();
      this.__data = ({a: {b: qxObject}});

      this.__marshaler.toClass(this.__data);

      // set the data
      var model = this.__marshaler.toModel(this.__data);

      // check the model
      this.assertEquals(qxObject, model.a.b, "wrong qx object!");
    },


    testValidIdentifier: function() {
      // its a debug warning so only check on debug
      if (qx.core.Environment.get("qx.debug")) {
        var data = {"#affe" : 1};
        this.assertException(function() {
          // just check if the creation worked
          qx.data.marshal.Json.createModel(data);
        }, null, "The key '#affe' is not a valid JavaScript identifier.", "1");

        data = {"1" : 1, "true": false};
        // just check if the creation worked
        qx.data.marshal.Json.createModel(data);

        data = {"''''" : 1};
        this.assertException(function() {
          // just check if the creation worked
          qx.data.marshal.Json.createModel(data);
        }, null, "The key '''''' is not a valid JavaScript identifier.", "3");

        data = {"§AFFE" : 1};
        this.assertException(function() {
          // just check if the creation worked
          qx.data.marshal.Json.createModel(data);
        }, null, "The key '§AFFE' is not a valid JavaScript identifier.", "4");

        data = {"ja!" : 1};
        this.assertException(function() {
          // just check if the creation worked
          qx.data.marshal.Json.createModel(data);
        }, null, "The key 'ja!' is not a valid JavaScript identifier.", "5");
      }
    },


    /**
     * @ignore(qx.test.model)
     */
    testGetModelClass: function() {
      qx.Bootstrap.define("qx.test.model.C", {
        extend : qx.event.Emitter,
        properties : {
          s : {event : "s"},
          b : {event : "b"},
          n : {event : "n"}
        }
      });

      var self = this;
      var delegate = {getModelClass : function(properties) {
        self.assertEquals('b"n"s', properties);
        return qx.test.model.C;
      }};

      this.__marshaler = new qx.data.marshal.Json(delegate);
      this.__marshaler.toClass(this.__data);
      var model = this.__marshaler.toModel(this.__data);

      this.assertTrue(model instanceof qx.test.model.C);
      this.assertEquals("String", model.s);
      this.assertEquals(12, model.n);
      this.assertTrue(model.b);


      delete qx.test.model.C;
    },


    testGetModelClassDepth: function() {
      var called = 0;
      var delegate = {getModelClass : function(properties, object, parentProperty, depth) {
        called++;
        if (properties == "a") {
          this.assertEquals(data, object);
          this.assertNull(parentProperty);
          this.assertEquals(0, depth);
        } else if (properties == "b") {
          this.assertEquals(data.a, object);
          this.assertEquals("a", parentProperty);
          this.assertEquals(1, depth);
        } else if (properties == "c") {
          this.assertEquals(data.a.b[0], object);
          this.assertEquals("b[0]", parentProperty);
          this.assertEquals(3, depth);
        } else {
          this.fail("Unknown property in the marshaler.");
        }
      }.bind(this)};

      var data = {a: {b: [{c: 1}]}};
      this.__marshaler = new qx.data.marshal.Json(delegate);
      this.__marshaler.toClass(data);
      this.assertEquals(3, called);
      var model = this.__marshaler.toModel(data);
      this.assertEquals(6, called);


    },


    testGetModelClassIgnore: function() {
      qx.Bootstrap.define("qx.test.model.C", {
        extend : qx.event.Emitter,
        properties : {
          b : {event : "b"}
        }
      });

      var self = this;
      var delegate = {getModelClass : function(properties) {
        self.assertEquals('b"n"s', properties);
        return qx.test.model.C;
      }};

      this.__marshaler = new qx.data.marshal.Json(delegate);
      this.__marshaler.toClass(this.__data);
      var model = this.__marshaler.toModel(this.__data);

      this.assertTrue(model instanceof qx.test.model.C);

      this.assertUndefined(model.getS);
      this.assertUndefined(model.getN);
      this.assertTrue(model.b);


      delete qx.test.model.C;
    },


    testGetModelSuperClass: function() {
      var called = 0;
      var delegate = {getModelSuperClass : function(properties, parentProperty, depth) {
        called++;
        if (properties == "a") {
          this.assertNull(parentProperty);
          this.assertEquals(0, depth);
        } else if (properties == "b") {
          this.assertEquals("a", parentProperty);
          this.assertEquals(1, depth);
        } else if (properties == "c") {
          this.assertEquals("b[0]", parentProperty);
          this.assertEquals(3, depth);
        } else {
          this.fail("Unknown property in the marshaler.");
        }
      }.bind(this)};

      var data = {a: {b: [{c: 1}]}};
      this.__marshaler = new qx.data.marshal.Json(delegate);
      this.__marshaler.toClass(data);
      this.assertEquals(3, called);
    },


    testGetModelMixins: function() {
      var called = 0;
      var delegate = {getModelMixins : function(properties, parentProperty, depth) {
        called++;
        if (properties == "a") {
          this.assertNull(parentProperty);
          this.assertEquals(0, depth);
        } else if (properties == "b") {
          this.assertEquals("a", parentProperty);
          this.assertEquals(1, depth);
        } else if (properties == "c") {
          this.assertEquals("b[0]", parentProperty);
          this.assertEquals(3, depth);
        } else {
          this.fail("Unknown property in the marshaler.");
        }
      }.bind(this)};

      var data = {a: {b: [{c: 1}]}};
      this.__marshaler = new qx.data.marshal.Json(delegate);
      this.__marshaler.toClass(data);
      this.assertEquals(3, called);
    },


    testGetPropertyMapping: function() {
      var delegate = {getPropertyMapping : function(property, properties) {
        return property + property + property;
      }};

      this.__marshaler = new qx.data.marshal.Json(delegate);
      this.__marshaler.toClass(this.__data);
      var model = this.__marshaler.toModel(this.__data);

      this.assertEquals("String", model.sss);
      this.assertEquals(12, model.nnn);
      this.assertTrue(model.bbb);
    },


    testIgnoreParent: function() {
      var called = 0;
      var delegate = {ignore : function(properties, parentProperty, depth) {
        called++;
        if (properties == "a") {
          this.assertNull(parentProperty);
          this.assertEquals(0, depth);
        } else if (properties == "b") {
          this.assertEquals("a", parentProperty);
          this.assertEquals(1, depth);
        } else if (properties == "c") {
          this.assertEquals("b[0]", parentProperty);
          this.assertEquals(3, depth);
        } else {
          this.fail("Unknown property in the marshaler.");
        }
      }.bind(this)};

      var data = {a: {b: [{c: 1}]}};
      this.__marshaler = new qx.data.marshal.Json(delegate);
      this.__marshaler.toClass(data);
      this.assertEquals(3, called);
    },


    testIgnoreDepth: function() {
      var delegate = {ignore : function(properties, parentProperty, depth) {
        return depth >= 1;
      }};

      this.__marshaler = new qx.data.marshal.Json(delegate);

      var data = {a: [0], b: {x: 1}, c: {y: 2}};

      this.__marshaler.toClass(data);
      var model = this.__marshaler.toModel(data);

      this.assertEquals(0, model.a[0]);
      this.assertEquals(1, model.b.x);
      this.assertEquals(2, model.c.y);


    },



    testIgnoreProperties: function() {
      var delegate = {ignore : function(properties, parentProperty, depth) {
        return properties == "x";
      }};

      this.__marshaler = new qx.data.marshal.Json(delegate);

      var data = {a: [], b: {x: 1}, c: {y: 2}};

      this.__marshaler.toClass(data);
      var model = this.__marshaler.toModel(data);

      this.assertInstance(model.a, qx.data.Array);
      this.assertEquals(1, model.b.x);
      this.assertInstance(model.c, Object);
      this.assertEquals(2, model.c.y);


    },


    testBubbleSpliceRemoveAndAdd : function() {
      var data = [{label: "Desktop"}];

      var model = qx.data.marshal.Json.createModel(data, true);
      var spy = this.spy();
      model.on("changeBubble", spy);

      model.splice(1, 1, model.getItem(0));
      this.assertCalledOnce(spy);

      model.getItem(0).label = "pistole";
      this.assertCalledTwice(spy);
    },


    testGetArrayClassSimple : function() {
      qx.Bootstrap.define("qx.test.Array", {
        extend : qx.data.Array
      });

      var delegate = {getArrayClass : function(parentProperty, depth) {
        this.assertNull(parentProperty);
        this.assertEquals(0, depth, "'depth' property is wrong");
        return qx.test.Array;
      }.bind(this)};

      this.__marshaler = new qx.data.marshal.Json(delegate);

      var data = ["a", "b"];

      this.__marshaler.toClass(data);
      var model = this.__marshaler.toModel(data);

      this.assertInstance(model, qx.test.Array);


      delete qx.test.Array;
    },


    testGetArrayClassAdvanced : function() {
      qx.Bootstrap.define("qx.test.Array", {
        extend : qx.data.Array
      });
      var called = 0;
      var delegate = {getArrayClass : function(parentProperty, depth) {
        called++;
        if (parentProperty == "a") {
          this.assertEquals(1, depth, "'depth' property is wrong");
          return null;
        } else if (parentProperty == "b") {
          this.assertEquals(1, depth, "'depth' property is wrong");
          return qx.test.Array;
        } else if (parentProperty == "e") {
          this.assertEquals(2, depth, "'depth' property is wrong");
          return qx.test.Array;
        } else if (parentProperty == "f") {
          this.assertEquals(2, depth, "'depth' property is wrong");
          return null;
        } else {
          this.fail("Unknown 'parentProperty' in the marshaler.");
        }
      }.bind(this)};

      this.__marshaler = new qx.data.marshal.Json(delegate);

      var data = {a: [], b: [], c: {d: "d", e: [], f: []}};

      this.__marshaler.toClass(data);
      var model = this.__marshaler.toModel(data);

      this.assertInstance(model.a, qx.data.Array);
      this.assertInstance(model.b, qx.test.Array);
      this.assertInstance(model.c.e, qx.test.Array);
      this.assertInstance(model.c.f, qx.data.Array);
      this.assertEquals(4, called);


      delete qx.test.Array;
    }
  }
});
