/* ************************************************************************

 qooxdoo - the new era of web development

 http://qooxdoo.org

 Copyright:
 2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.

 Authors:
 * Christian Hagendorn (chris_schmidt)

 ************************************************************************ */

describe("util.Delegate", function () {

  var __delegate;

  beforeEach(function () {
    __delegate = {
      STATIC: true,

      myMethod: function () {
      }
    };
  });

  afterEach(function () {
    __delegate = null;
  });

  it("GetMethod", function () {
    assert.isNotNull(qx.util.Delegate.getMethod(__delegate, "myMethod"));
    assert.isFunction(qx.util.Delegate.getMethod(__delegate, "myMethod"));

    assert.isNull(qx.util.Delegate.getMethod(__delegate, "STATIC"));
    assert.isNull(qx.util.Delegate.getMethod(__delegate, "banana"));
  });

  it("ContainsMethod", function () {
    assert.isTrue(qx.util.Delegate.containsMethod(__delegate, "myMethod"));
    assert.isFalse(qx.util.Delegate.containsMethod(__delegate, "STATIC"));
    assert.isFalse(qx.util.Delegate.containsMethod(__delegate, "banana"));
  });

  it("MethodCall", function () {
    var spy = sinon.spy(__delegate, "myMethod");

    var myMethod = qx.util.Delegate.getMethod(__delegate, "myMethod");
    myMethod(99, 89, 99);

    sinon.assert.called(spy);
    sinon.assert.calledWith(spy, 99, 89, 99);
    sinon.assert.calledOn(spy, __delegate);
  });
});
