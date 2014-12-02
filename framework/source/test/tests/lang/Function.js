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

/**
 * @ignore(qx.test.Name.*)
 */

describe("lang.Function", function() {

  it("GlobalEval", function() {
    qx.lang.Function.globalEval("var JUHU=12;");
    assert.equal(12, window.JUHU);

    try {
      delete window.JUHU;
    } catch (e) {
      window.JUHU = null;
    }
  });

  it("GetCaller", function() {

    var fcn = arguments.callee;

    function f1(caller) {
      assert.strictEqual(caller, qx.lang.Function.getCaller(arguments), "Wrong caller.");
    }

    function f2() {
      f1(f2);
    }

    f2();
    f1(fcn);
  });

  it("FunctionWrap", function() {
    var context = null;
    var result = 0;

    var add = function(a, b) {
      context = this;
      return a + b;
    };

    context = null;
    result = add(1, 2);

    assert.equal(context, window);
    assert.equal(3, result);

    context = null;
    var boundAdd = qx.lang.Function.bind(add, this);
    result = boundAdd(1, 3);
    assert.equal(context, this);
    assert.equal(4, result);

    context = null;
    var addOne = qx.lang.Function.bind(add, this, 1);
    result = addOne(4);
    assert.equal(context, this);
    assert.equal(5, result);
  });

  it("BindWithUndefinedArguments", function() {
    var undef;
    var callback = function(undef, arg) {
      assert.isTrue(arg);
    };
    var bound = qx.lang.Function.bind(callback, this, undef, true);
    bound();
  });

  it("GetName", function() {
    qx.Class.define("qx.test.Name", {
      extend: Object,
      construct: function() {},

      properties: {
        prop: {}
      },

      statics: {
        foo: function() {}
      },

      members: {
        bar: function() {}
      }
    });


    var name = new qx.test.Name();
    assert.equal("qx.test.Name.constructor()", qx.lang.Function.getName(qx.test.Name));

    name.prop = 1;

    assert.equal("qx.test.Name.foo()", qx.lang.Function.getName(qx.test.Name.foo));
    assert.equal("qx.test.Name.prototype.bar()", qx.lang.Function.getName(name.bar));

    assert.equal("anonymous()", qx.lang.Function.getName(function() {}));

    function named() {}
    // the variable optimizer renames the "named" function. Only perform this
    // test if variable optimization is off.
    if (named.toString().indexOf("named") !== -1) {
      assert.equal("named()", qx.lang.Function.getName(named));
    }
  });
});
