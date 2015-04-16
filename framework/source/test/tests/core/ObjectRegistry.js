/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */
describe("core.ObjectRegistry", function () {

  it("main", function () {
    var data = {
      key: "value"
    };
    qx.core.ObjectRegistry.register(data);

    var data2 = {
      key: "value"
    };
    qx.core.ObjectRegistry.register(data2);

    var data3 = {
      key: "value"
    };

    qx.core.ObjectRegistry.toHashCode(data3);
    qx.core.ObjectRegistry.register(data);
    qx.core.ObjectRegistry.fromHashCode(data.$hash);

    var registry = qx.core.ObjectRegistry.getRegistry();
    assert.deepEqual(Object.keys(registry), ["0-0", "1-0"]);
    assert.equal(3, qx.core.ObjectRegistry.getNextHash());
    assert.equal("-0", qx.core.ObjectRegistry.getPostId());
    
    qx.core.ObjectRegistry.unregister(data);
    qx.core.ObjectRegistry.clearHashCode(data);
    qx.core.ObjectRegistry.shutdown();
    
    if (qx.core.Environment.get("qx.debug")) {
      assert.throw(function() {
        qx.core.ObjectRegistry.clearHashCode();
      }, Error);
    }
  });  
});