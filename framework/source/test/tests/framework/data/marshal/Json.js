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
 * @ignore(qx.Test)
 * @ignore(qx.test.Array)
 */

describe("data.marshal.Json", function() {

  var __marshaler = null;
  var __data = null;
  var __propertyNames = null;

  beforeEach(function() {
    __marshaler = new qx.data.marshal.Json();

    __data = {
      s: 'String',
      n: 12,
      b: true
    };
    __propertyNames = ["s", "n", "b"];
  });

  /**
   * @ignore(qx.data.model)
   */
  afterEach(function() {
    // remove the former created classes
    qx.data.model = {};
  });


  it("$$member", function() {
    var data = {
      $$a: "b"
    };
    __marshaler.toClass(data);

    // check if the class is defined
    assert.isNotNull(qx.Class.getByName('qx.data.model.$$a'), "Class not created.");

    var clazz = qx.Class.getByName('qx.data.model.$$a');
    // check for the property
    for (var name in clazz.prototype.$$properties) {
      assert.equal("$$a", name, "Property $$a does have the wrong name.");
      assert.isTrue(clazz.prototype.$$properties[name].event, "event has a wrong name.");
    }
  });


  it("LocalizedString", function() {

    var str = qx.locale.Manager.tr("test one");
    var data = {
      a: str
    };
    __marshaler.toClass(data);

    var model = __marshaler.toModel(data);

    assert.equal(str, model.a);
  });


  it("ClassCreationSingle", function() {

    __marshaler.toClass(__data);

    // check if the class is defined
    assert.isNotNull(qx.Class.getByName('qx.data.model.b"n"s'), "Class not created.");

    var clazz = qx.Class.getByName('qx.data.model.b"n"s');
    // check for the properties
    var i = 0;
    for (var name in clazz.prototype.$$properties) {
      assert.equal(__propertyNames[i], name, "Property " + i + "does have the wrong name.");
      assert.isTrue(clazz.prototype.$$properties[name].event, "event has a wrong name.");
      i++;
    }
  });


  it("ClassCreationArray", function() {
    __data = {
      a: ['a', 'b', 'c']
    };

    __marshaler.toClass(__data);

    // check if the class is defined
    assert.isNotNull(qx.Class.getByName("qx.data.model.a"), "Class not created.");

    var clazz = qx.Class.getByName("qx.data.model.a");
    // check for the property
    assert.isNotNull(clazz.prototype.$$properties.a, "Property does not exist.");
  });


  /**
   * @ignore(qx.data.model.a.classname)
   * @ignore(qx.data.model.b.classname)
   * @ignore(qx.data.model.a.prototype.$$properties.a)
   * @ignore(qx.data.model.b.prototype.$$properties.b)
   */

  it("ClassCreationObject", function() {
    __data = {
      a: {
        b: 'test'
      }
    };

    __marshaler.toClass(__data);

    // check if the classes are defined
    assert.equal("qx.data.model.a", qx.data.model.a.classname, "Class not created.");
    assert.equal("qx.data.model.b", qx.data.model.b.classname, "Class not created.");

    // check for the property
    assert.isNotNull(qx.data.model.a.prototype.$$properties.a, "Property does not exist.");
    assert.isNotNull(qx.data.model.b.prototype.$$properties.b, "Property does not exist.");
  });


  it("ClassCreationArrayWithObject", function() {
    __data = {
      a: [{
        b: 'test'
      }, {
        b: 'test'
      }]
    };

    __marshaler.toClass(__data);

    // check if the classes are defined
    assert.isNotNull(qx.Class.getByName("qx.data.model.a"), "Class not created.");
    assert.isNotNull(qx.Class.getByName("qx.data.model.b"), "Class not created.");

    var clazz = qx.Class.getByName("qx.data.model.a");
    var clazz2 = qx.Class.getByName("qx.data.model.b");
    // check for the property
    assert.isNotNull(clazz.prototype.$$properties.a, "Property does not exist.");
    assert.isNotNull(clazz2.prototype.$$properties.b, "Property does not exist.");
  });


  it("ClassCreationAllSmoke", function() {
    __data = {
      a: [{
        b: 'test',
        c: ['f', 'x', 'e']
      }, {
        b: 'test',
        affe: false
      }],
      t: {
        f: null,
        r: 152,
        q: true
      }
    };
    __marshaler.toClass(__data);
  });


  it("ModelWithNumber", function() {
    __data = {
      a: 10,
      b: -15,
      c: 10.5e10
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    assert.equal(10, model.a, "getA does not work.");
    assert.equal(-15, model.b, "getB does not work.");
    assert.equal(10.5e10, model.c, "getC does not work.");
  });


  it("ModelWithBoolean", function() {
    __data = {
      a: true,
      b: false
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    assert.equal(true, model.a, "getA does not work.");
    assert.equal(false, model.b, "getB does not work.");
  });


  it("ModelWithString", function() {
    __data = {
      a: 'affe',
      b: 'AFFE'
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    assert.equal("affe", model.a, "getA does not work.");
    assert.equal("AFFE", model.b, "getB does not work.");
  });


  it("ModelWithPrimitive", function() {
    __data = {
      a: 'affe',
      b: true,
      c: 156
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    assert.equal("affe", model.a, "getA does not work.");
    assert.equal(true, model.b, "getB does not work.");
    assert.equal(156, model.c, "getC does not work.");
  });


  it("ModelWithArrayPrimitive", function() {
    __data = {
      a: ['affe', 'affen', 'AFFE']
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    var a = model.a;
    assert.isNotNull(a, "Nothing stored in the property a.");
    assert.equal("qx.data.Array", a.classname, "Its not an data array.");
    assert.equal("affe", a.getItem(0), "Item 0 is wrong");
    assert.equal("affen", a.getItem(1), "Item 1 is wrong");
    assert.equal("AFFE", a.getItem(2), "Item 2 is wrong");
  });


  it("ModelWithArrayArray", function() {
    __data = {
      a: [
        [true, false],
        [10, 15]
      ]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    var a = model.a;
    assert.isNotNull(a, "Nothing stored in the property a.");
    assert.equal("qx.data.Array", a.classname, "Its not an data array.");

    var a0 = a.getItem(0);
    assert.equal("qx.data.Array", a0.classname, "Its not an data array.");
    assert.equal(true, a0.getItem(0), "Item 0 is wrong");
    assert.equal(false, a0.getItem(1), "Item 1 is wrong");

    var a1 = a.getItem(1);
    assert.equal("qx.data.Array", a1.classname, "Its not an data array.");
    assert.equal(10, a1.getItem(0), "Item 0 is wrong");
    assert.equal(15, a1.getItem(1), "Item 1 is wrong");
  });


  it("ModelWithObjectPrimitive", function() {
    __data = {
      a: {
        b: true,
        bb: false
      },
      aa: {
        c: 15,
        cc: -89
      }
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    var a = model.a;
    assert.isNotNull(a, "Nothing stored in the property a.");
    assert.equal(true, a.b, "b is not set");
    assert.equal(false, a.bb, "bb is not set");

    var aa = model.aa;
    assert.isNotNull(aa, "Nothing stored in the property a.");
    assert.equal(15, aa.c, "c is not set");
    assert.equal(-89, aa.cc, "cc is not set");
  });


  it("ModelWithObjectArray", function() {
    __data = {
      a: {
        b: ['affe', 'AFFE']
      }
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    var a = model.a;
    assert.isNotNull(a, "Nothing stored in the property a.");
    var b = a.b;
    assert.isNotNull(b, "Nothing stored in the property b.");
    assert.equal("qx.data.Array", b.classname, "b is not an data array");
    assert.equal("affe", b.getItem(0), "Item 0 is wrong.");
    assert.equal("AFFE", b.getItem(1), "Item 1 is wrong.");
  });


  it("ModelWithArrayObject", function() {
    __data = {
      a: [{
        a: 15
      }, {
        a: true
      }]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    var a = model.a;
    assert.isNotNull(a, "Nothing stored in the property a.");
    assert.equal("qx.data.Array", a.classname, "b is not an data array");

    assert.equal(15, a.getItem(0).a, "Item 0 is wrong.");
    assert.equal(true, a.getItem(1).a, "Item 1 is wrong.");

    // check if only one class is created and used
    assert.equal(model.classname, a.getItem(0).classname, "Differen classes");
    assert.equal(model.classname, a.getItem(1).classname, "Differen classes");
    assert.equal(a.getItem(0).classname, a.getItem(1).classname, "Differen classes");
  });


  it("ModelWithObjectObject", function() {
    __data = {
      a: {
        a: {
          a: 'affe'
        }
      }
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    assert.equal("affe", model.a.a.a, "No affe is there!");
  });


  it("ModelWithAllSmoke", function() {
    __data = {
      a: [{
        aa: ['affe'],
        ab: false,
        ac: []
      }, {}, true, 15, 'affe'],
      b: 'Affe',
      c: {
        ca: 156,
        cb: [null, null],
        cc: true
      }
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data);
    // set the data
    var model = __marshaler.toModel(__data);

    assert.isNotNull(model, "No model set.");
  });


  it("BubbleEventsDepth1", function() {
    __data = {
      a: 10,
      b: -15,
      c: 10.5e10
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for a

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a = (0);
    }, function(data) {
      assert.equal(0, data.value, "Not the right value in the event.");
      assert.equal(10, data.old, "Not the right old value in the event.");
      assert.equal("a", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model, data.item, "Not the right item in the event.");
    }, "Change event not fired!");

    // check the event for b
    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.b = (0);
    }, function(data) {
      assert.equal(0, data.value, "Not the right value in the event.");
      assert.equal(-15, data.old, "Not the right old value in the event.");
      assert.equal("b", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model, data.item, "Not the right item in the event.");
    }, "Change event not fired!");
  });


  it("BubbleEventsDepth2", function() {
    __data = {
      a: {
        b: 10,
        c: 20
      }
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for b

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.b = (0);
    }, function(data) {
      assert.equal(0, data.value, "Not the right value in the event.");
      assert.equal(10, data.old, "Not the right old value in the event.");
      assert.equal("a.b", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a, data.item, "Not the right item in the event.");
    }, "Change event not fired!");

    // check the event for a
    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a = (true);
    }, function(data) {
      assert.equal(true, data.value, "Not the right value in the event.");
      assert.equal("a", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model, data.item, "Not the right item in the event.");
    }, "Change event not fired!");

  });


  it("BubbleEventsDepth3", function() {
    __data = {
      a: {
        b: {
          c: 10
        }
      }
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for c

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.b.c = (0);
    }, function(data) {
      assert.equal(0, data.value, "Not the right value in the event.");
      assert.equal(10, data.old, "Not the right old value in the event.");
      assert.equal("a.b.c", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a.b, data.item, "Not the right item in the event.");
    }, "Change event not fired!");

  });


  it("BubbleEventsArrayDepth1", function() {
    __data = {
      a: [12, 23, 34]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for the first array element

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.setItem(0, 1);
    }, function(data) {
      assert.equal(1, data.value, "Not the right value in the event.");
      assert.equal("a[0]", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a, data.item, "Not the right item in the event.");
    }, "Change event not fired!");


  });


  it("BubbleEventsArrayDepth2", function() {
    __data = {
      a: [{
        b: 10
      }, {
        b: 11
      }]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for the first array element

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.getItem(0).b = (0);
    }, function(data) {
      assert.equal(0, data.value, "Not the right value in the event.");
      assert.equal("a[0].b", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a.getItem(0), data.item, "Not the right item in the event.");
    }, "Change event not fired!");

  });


  it("BubbleEventsArrayDepthAlot", function() {
    __data = {
      a: [
        [
          [
            [{
              b: 10
            }]
          ]
        ]
      ]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for the first array element

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.getItem(0).getItem(0).getItem(0).getItem(0).b = (0);
    }, function(data) {
      assert.equal(0, data.value, "Not the right value in the event.");
      assert.equal("a[0][0][0][0].b", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a.getItem(0).getItem(0).getItem(0).getItem(0), data.item, "Not the right item in the event.");
    }, "Change event not fired!");

  });


  it("BubbleEventsArrayDepthAlotMix", function() {
    __data = {
      a: [{
        b: [
          [{
            c: {
              d: [0, 1]
            }
          }]
        ]
      }]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for the first array element

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.getItem(0).b.getItem(0).getItem(0).c.d.setItem(1, 12);
    }, function(data) {
      assert.equal(12, data.value, "Not the right value in the event.");
      assert.equal("a[0].b[0][0].c.d[1]", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a.getItem(0).b.getItem(0).getItem(0).c.d, data.item, "Not the right item in the event.");
    }, "Change event not fired!");

  });


  it("BubbleEventsArrayLong", function() {
    __data = {
      a: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    // check the event for the first array element

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.setItem(10, "AFFE");
    }, function(data) {
      assert.equal("AFFE", data.value, "Not the right value in the event.");
      assert.equal("a[10]", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a, data.item, "Not the right item in the event.");
    }, "Change event not fired!");

  });


  it("BubbleEventsArrayReorder", function() {
    __data = {
      a: [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
    // first create the classes before setting the data
    __marshaler.toClass(__data, true);
    // set the data
    var model = __marshaler.toModel(__data);

    model.a.sort();

    // check the event for the first array element

    qx.core.Assert.assertEventFired(model, "changeBubble", function() {
      model.a.setItem(0, "AFFE");
    }, function(data) {
      assert.equal("AFFE", data.value, "Not the right value in the event.");
      assert.equal("a[0]", data.name, "Not the right name in the event.");
      assert.isString(data.name, "name is not a String.");
      assert.equal(model.a, data.item, "Not the right item in the event.");
    }, "Change event not fired!");

  });


  it("BubbleEventsWithRemove", function() {
    qx.Class.define("qx.Test", {
      extend: Object,
      include: [qx.event.MEmitter, qx.data.marshal.MEventBubbling],
      properties: {
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
      assert.equal("fonts[0-2]", data.name, "Wrong name");
      assert.isString(data.name, "name is not a String.");
      assert.deepEqual(["one", "two", "three"], data.old, "Wrong old data");
      assert.equal(0, data.value.length, "Wrong data");
    }, this);

    // remove all
    model.fonts.removeAll();

    assert.equal(0, model.fonts.length, "The remove did not work.");
  });


  it("QooxdooObject", function() {
    var qxObject = new qxWeb();
    __data = ({
      a: {
        b: qxObject
      }
    });

    __marshaler.toClass(__data);

    // set the data
    var model = __marshaler.toModel(__data);

    // check the model
    assert.equal(qxObject, model.a.b, "wrong qx object!");
  });


  it("ValidIdentifier", function() {
    // its a debug warning so only check on debug
    if (qx.core.Environment.get("qx.debug")) {

      var data = {
        "#affe": 1
      };
      qx.core.Assert.assertException(function() {
        // just check if the creation worked
        qx.data.marshal.Json.createModel(data);
      }, null, "The key '#affe' is not a valid JavaScript identifier.", "1");

      data = {
        "1": 1,
        "true": false
      };
      // just check if the creation worked
      qx.data.marshal.Json.createModel(data);

      data = {
        "''''": 1
      };
      qx.core.Assert.assertException(function() {
        // just check if the creation worked
        qx.data.marshal.Json.createModel(data);
      }, null, "The key '''''' is not a valid JavaScript identifier.", "3");

      data = {
        "§AFFE": 1
      };
      qx.core.Assert.assertException(function() {
        // just check if the creation worked
        qx.data.marshal.Json.createModel(data);
      }, null, "The key '§AFFE' is not a valid JavaScript identifier.", "4");

      data = {
        "ja!": 1
      };
      qx.core.Assert.assertException(function() {
        // just check if the creation worked
        qx.data.marshal.Json.createModel(data);
      }, null, "The key 'ja!' is not a valid JavaScript identifier.", "5");
    }

  });

  /**
   * @ignore(qx.test.model.C)
   */

  it("GetModelClass", function() {
    qx.Class.define("qx.test.model.C", {
      extend: Object,
      include: [qx.event.MEmitter],
      properties: {
        s: {
          event: true
        },
        b: {
          event: true
        },
        n: {
          event: true
        }
      }
    });


    var delegate = {
      getModelClass: function(properties) {
        assert.equal('b"n"s', properties);
        return qx.test.model.C;
      }
    };

    __marshaler = new qx.data.marshal.Json(delegate);
    __marshaler.toClass(__data);
    var model = __marshaler.toModel(__data);

    assert.isTrue(model instanceof qx.test.model.C);
    assert.equal("String", model.s);
    assert.equal(12, model.n);
    assert.isTrue(model.b);

    delete qx.test.model.C;
  });


  it("GetModelClassDepth", function() {
    var called = 0;
    var delegate = {
      getModelClass: function(properties, object, parentProperty, depth) {
        called++;
        if (properties == "a") {
          assert.equal(data, object);
          assert.isNull(parentProperty);
          assert.equal(0, depth);
        } else if (properties == "b") {
          assert.equal(data.a, object);
          assert.equal("a", parentProperty);
          assert.equal(1, depth);
        } else if (properties == "c") {
          assert.equal(data.a.b[0], object);
          assert.equal("b[0]", parentProperty);
          assert.equal(3, depth);
        } else {
          fail("Unknown property in the marshaler.");
        }
      }.bind(this)
    };

    var data = {
      a: {
        b: [{
          c: 1
        }]
      }
    };
    __marshaler = new qx.data.marshal.Json(delegate);
    __marshaler.toClass(data);
    assert.equal(3, called);
    var model = __marshaler.toModel(data);
    assert.equal(6, called);

  });


  //     /**
  //      * @ignore(qx.test.model.C)
  //      */

  it("GetModelClassIgnore", function() {
    qx.Class.define("qx.test.model.C", {
      extend: Object,
      include: [qx.event.MEmitter],
      properties: {
        b: {
          event: true
        }
      }
    });


    var delegate = {
      getModelClass: function(properties) {
        assert.equal('b"n"s', properties);
        return qx.test.model.C;
      }
    };

    __marshaler = new qx.data.marshal.Json(delegate);
    __marshaler.toClass(__data);
    var model = __marshaler.toModel(__data);

    assert.isTrue(model instanceof qx.test.model.C);

    assert.isUndefined(model.getS);
    assert.isUndefined(model.getN);
    assert.isTrue(model.b);


    delete qx.test.model.C;
  });


  it("GetModelSuperClass", function() {
    var called = 0;
    var delegate = {
      getModelSuperClass: function(properties, parentProperty, depth) {
        called++;
        if (properties == "a") {
          assert.isNull(parentProperty);
          assert.equal(0, depth);
        } else if (properties == "b") {
          assert.equal("a", parentProperty);
          assert.equal(1, depth);
        } else if (properties == "c") {
          assert.equal("b[0]", parentProperty);
          assert.equal(3, depth);
        } else {
          fail("Unknown property in the marshaler.");
        }
      }.bind(this)
    };

    var data = {
      a: {
        b: [{
          c: 1
        }]
      }
    };
    __marshaler = new qx.data.marshal.Json(delegate);
    __marshaler.toClass(data);
    assert.equal(3, called);
  });


  it("GetModelMixins", function() {
    var called = 0;
    var delegate = {
      getModelMixins: function(properties, parentProperty, depth) {
        called++;
        if (properties == "a") {
          assert.isNull(parentProperty);
          assert.equal(0, depth);
        } else if (properties == "b") {
          assert.equal("a", parentProperty);
          assert.equal(1, depth);
        } else if (properties == "c") {
          assert.equal("b[0]", parentProperty);
          assert.equal(3, depth);
        } else {
          fail("Unknown property in the marshaler.");
        }
      }.bind(this)
    };

    var data = {
      a: {
        b: [{
          c: 1
        }]
      }
    };
    __marshaler = new qx.data.marshal.Json(delegate);
    __marshaler.toClass(data);
    assert.equal(3, called);
  });


  it("GetPropertyMapping", function() {
    var delegate = {
      getPropertyMapping: function(property, properties) {
        return property + property + property;
      }
    };

    __marshaler = new qx.data.marshal.Json(delegate);
    __marshaler.toClass(__data);
    var model = __marshaler.toModel(__data);

    assert.equal("String", model.sss);
    assert.equal(12, model.nnn);
    assert.isTrue(model.bbb);
  });


  it("IgnoreParent", function() {
    var called = 0;
    var delegate = {
      ignore: function(properties, parentProperty, depth) {
        called++;
        if (properties == "a") {
          assert.isNull(parentProperty);
          assert.equal(0, depth);
        } else if (properties == "b") {
          assert.equal("a", parentProperty);
          assert.equal(1, depth);
        } else if (properties == "c") {
          assert.equal("b[0]", parentProperty);
          assert.equal(3, depth);
        } else {
          fail("Unknown property in the marshaler.");
        }
      }.bind(this)
    };

    var data = {
      a: {
        b: [{
          c: 1
        }]
      }
    };
    __marshaler = new qx.data.marshal.Json(delegate);
    __marshaler.toClass(data);
    assert.equal(3, called);
  });


  it("IgnoreDepth", function() {
    var delegate = {
      ignore: function(properties, parentProperty, depth) {
        return depth >= 1;
      }
    };

    __marshaler = new qx.data.marshal.Json(delegate);

    var data = {
      a: [0],
      b: {
        x: 1
      },
      c: {
        y: 2
      }
    };

    __marshaler.toClass(data);
    var model = __marshaler.toModel(data);

    assert.equal(0, model.a[0]);
    assert.equal(1, model.b.x);
    assert.equal(2, model.c.y);

  });


  it("IgnoreProperties", function() {
    var delegate = {
      ignore: function(properties, parentProperty, depth) {
        return properties == "x";
      }
    };

    __marshaler = new qx.data.marshal.Json(delegate);

    var data = {
      a: [],
      b: {
        x: 1
      },
      c: {
        y: 2
      }
    };

    __marshaler.toClass(data);
    var model = __marshaler.toModel(data);

    assert.instanceOf(model.a, qx.data.Array);
    assert.equal(1, model.b.x);
    assert.instanceOf(model.c, Object);
    assert.equal(2, model.c.y);
  });


  it("BubbleSpliceRemoveAndAdd", function() {
    var data = [{
      label: "Desktop"
    }, {
      label: "Mobil e"
    }];

    var model = qx.data.marshal.Json.createModel(data, true);
    var spy = sinon.spy();
    model.on("changeBubble", spy);

    var newItem = qx.data.marshal.Json.createModel({
      label: "Server"
    }, true);
    model.splice(1, 1, newItem);
    assert(spy.calledOnce);

    model.getItem(0).label = "pistole";
    assert(spy.calledTwice);
  });


  it("GetArrayClassSimple", function() {
    qx.Class.define("qx.test.Array", {
      extend: qx.data.Array
    });

    var delegate = {
      getArrayClass: function(parentProperty, depth) {
        assert.isNull(parentProperty);
        assert.equal(0, depth, "'depth' property is wrong");
        return qx.test.Array;
      }.bind(this)
    };
    __marshaler = new qx.data.marshal.Json(delegate);

    var data = ["a", "b"];

    __marshaler.toClass(data);
    var model = __marshaler.toModel(data);

    assert.instanceOf(model, qx.test.Array);
    delete qx.test.Array;
  });


  it("GetArrayClassAdvanced", function() {
    qx.Class.define("qx.test.Array", {
      extend: qx.data.Array
    });
    var called = 0;
    var delegate = {
      getArrayClass: function(parentProperty, depth) {
        called++;
        if (parentProperty == "a") {
          assert.equal(1, depth, "'depth' property is wrong");
          return null;
        } else if (parentProperty == "b") {
          assert.equal(1, depth, "'depth' property is wrong");
          return qx.test.Array;
        } else if (parentProperty == "e") {
          assert.equal(2, depth, "'depth' property is wrong");
          return qx.test.Array;
        } else if (parentProperty == "f") {
          assert.equal(2, depth, "'depth' property is wrong");
          return null;
        } else {
          fail("Unknown 'parentProperty' in the marshaler.");
        }
      }.bind(this)
    };

    __marshaler = new qx.data.marshal.Json(delegate);

    var data = {
      a: [],
      b: [],
      c: {
        d: "d",
        e: [],
        f: []
      }
    };
    __marshaler.toClass(data);
    var model = __marshaler.toModel(data);

    assert.instanceOf(model.a, qx.data.Array);
    assert.instanceOf(model.b, qx.test.Array);
    assert.instanceOf(model.c.e, qx.test.Array);
    assert.instanceOf(model.c.f, qx.data.Array);
    assert.equal(4, called);
    delete qx.test.Array;
  });
});
