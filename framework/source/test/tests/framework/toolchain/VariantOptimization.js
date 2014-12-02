/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-20011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Thomas Herchenroeder (thron7)

************************************************************************ */

describe("toolchain.VariantOptimization", function() {

  beforeEach(function() {
    if (qx.core.Environment.get("qx.debug") ||
        !qx.core.Environment.get("qx.optimization.variants"))
    {
      this.currentTest.skip = true;
    }
  });

  afterEach(function(){
    qx.core.Environment.getChecks()["qx.test.bool_true"] = function() {
      return true;
    };
  });

  /*
   * 1.
   *
   * The next tests whether the generator optimized an 'if' statement, so that
   * only the 'then' branch made it into the optimized code.
   */
  it("If 'if' statement is pruned by the generator", function() {
    if (this.test.skip) {
      return;
    }

    var a = 0;
    /*
     * "qx.test.bool_true" and "qx.test.bool_false" are custom environment
     * keys that are set in config.json for the framework's AUT.
     *
     * Faking "qx.test.bool_true" to temporarily evaluate to false here.
     * (Undone in the "tearDown" method).
     */
    qx.core.Environment.getChecks()["qx.test.bool_true"] = function() {
      return false;
    };
    /*
     * The 'if' statement should be optimized by the generator, as the value
     * of "qx.test.bool_true" is known at compile time, so that only "a = 1"
     * makes it into the generated code.
     *
     * If the 'if' is not optimized, the .get call will actually be performed
     * returning 'false' (see above), and the else branch will be executed.
     */
    if (qx.core.Environment.get("qx.test.bool_true")) {
      a = 1;
    } else {
      a = 2;
    }
    // The next will fail if the 'else' branch has been chosen, due to missing
    // or wrong optimization.
    assert.equal(1, a);
  });

  /*
   * 2.
   *
   * In the next test, we apply the same trick as above, to check that a .select
   * expression has been optimized.
   */
  it("If 'select' call is pruned by the generator", function() {
    if (this.test.skip) {
      return;
    }

    // Fake "qx.test.bool_true" to be false at run time.
    qx.core.Environment.getChecks()["qx.test.bool_true"] = function() {
      return false;
    };
    // Under optimization, the .select call will have been gone at run time.
    var a = qx.core.Environment.select("qx.test.bool_true", {
      "true": 1,
      "false": 2
    });
    assert.equal(1, a);
  });

  /*
   * 3.
   *
   * Check if a simple .get call is optimized.
   */
  it("test If simple 'get' call is pruned by the generator", function() {
    if (this.test.skip) {
      return;
    }

    // Fake "qx.test.bool_true" to be false at run time.
    qx.core.Environment.getChecks()["qx.test.bool_true"] = function() {
      return false;
    };
    // Under optimization, the .get call will have been gone at run time.
    var a = qx.core.Environment.get("qx.test.bool_true");
    assert.equal(true, a);
  });

});
